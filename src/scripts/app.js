import React from 'react'
import ReactDOM from 'react-dom'
import Backbone from 'backbone'
import ListView from './models'

const app = function() {

    var ListModel = Backbone.Model.extend ({
        defaults: {
            status: 'incomplete'
        }
    })

    var ListCollection = Backbone.Collection.extend ({
        model: ListModel
    })

    ReactDOM.render(<ListView listColl = {new ListCollection()} />, document.querySelector('.container'))
}

app()