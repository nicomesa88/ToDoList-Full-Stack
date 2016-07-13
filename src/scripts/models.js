import ReactDOM from 'react-dom'
import React from 'react'
import Backbone from 'backbone'



var ListView = React.createClass ({

    getInitialState: function () {
        return {
            listColl: this.props.listColl
            }
    },

    componentWillMount: function () {
        console.log('mounting')
        this.props.listColl.on('update', () => {
            this.setState({
                listColl: this.state.listColl
            })
        })
    }
})

function app() {

    var GoalModel = Backbone.Model.extend({

        defaults: {
            status: "Undone",
            priority: "normal"
        },

        initialize: function(newGoal) {
            this.set({goal: newGoal})
        }
    })

    var GoalCollection = Backbone.Collection.extend({
        model: GoalModel
    })

    var GoalView = React.createClass({

        _addGoal: function(goal) {
            this.state.goalColl.add(new GoalModel(goal))
            this._updater()

        },

        _genButtons: function() {
            var buttons = ["All", "Undone", "Done"].map(function(goalType){
                return <button className="gen-button" onClick={this._filterView} value={goalType}>{goalType}</button>
            }.bind(this))
            return buttons
        },

        _filterView: function(event) {
            var buttonView = event.target.value
            this.setState({
                viewType: buttonView
            })

        },

        _removeGoal: function(model) {
            this.state.goalColl.remove(model)
            this._updater()
        },

        _updater: function() {
            this.setState({
                goalColl: this.state.goalColl
            })
        },

        getInitialState: function() {
            return {
                goalColl: this.props.goalColl,
                viewType: "All"
            }

        },

        render: function() {
            var goalColl = this.state.goalColl
            if(this.state.viewType === "Undone") goalColl = goalColl.where({status: "Undone"})
            if (this.state.viewType === "Done") goalColl = goalColl.where({status: "Done"})
            return (
                    <div className="goalView">
                        <div className="header">
                        <h1 className="title">To-Do List</h1>
                        </div>

                        <div className="buttons">{this._genButtons()}</div>
                        <GoalAdder adderFunc={this._addGoal} />
                        <GoalList updater={this._updater} goalColl={goalColl} remover={this._removeGoal}/>
                </div>
            )
        }
    })

    var GoalAdder = React.createClass ({

        _handleKeyDown: function(keyEvent) {
            if (keyEvent.keyCode === 13) {
                var goalEntry = keyEvent.target.value
                keyEvent.target.value = ""
                this.props.adderFunc(goalEntry)
            }

        },

        render: function() {

            return <input onKeyDown={this._handleKeyDown} />
        }
    })

    var GoalList = React.createClass({

        _makeGoal: function(model) {
            return <Goal updater={this.props.updater} goalModel={model} remover={this.props.remover}/>
        },

        render: function() {
            return(
                <div className="goalList">
                    {this.props.goalColl.map(this._makeGoal)}
                </div>
            )
        }
    })

    var Goal = React.createClass ({

        _selectStatus: function(event) {
            var newStat = event.target.value
            this.props.goalModel.set({status:newStat})
            this.props.updater()
        },

        _removeWithClick: function() {
            this.props.remover(this.props.goalModel)
        },

        render: function() {
            var goalModel = this.props.goalModel
            return <div className="goal">
                    <p>{goalModel.get("goal")}</p>
                    <p>{goalModel.get("status")}</p>
                    <select onChange={this._selectStatus}>
                        <option value="">change status</option>
                        <option value="Undone">Undone</option>
                        <option value="Done">Done</option>
                    </select>
                    <button className="x-button" onClick={this._removeWithClick}>X</button>
                   </div>
        }
    })
    var GoalRouter = Backbone.Router.extend({
        routes: {
            "*default": "home"
        },
        home: function() {
            ReactDOM.render(<GoalView goalColl={new GoalCollection()}/>, document.querySelector('.container'))
        },
        initialize: function() {
            Backbone.history.start()
        }
    })
    var gr = new GoalRouter()

}
app()

export default ListView
