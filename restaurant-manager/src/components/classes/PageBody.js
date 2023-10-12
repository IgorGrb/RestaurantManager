import React, { Component } from 'react';
import Sales from '../functiones/options/Sales';
import Shift from '../functiones/options/Shift';
import Recipes from '../functiones/options/Recipes';
import Invoices from '../functiones/options/Invoices';
import Statistic from '../functiones/options/Statistic'


class PageBody extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
       recipes: [],
       groups: [],
       recipeList: []
    }
  }


  render() {
    if (this.props.pageOption === '') {
      return <div></div>
    } else if (this.props.pageOption === 'SALES') {
      return <Sales />
    } else if (this.props.pageOption === 'SHIFT') {
      return <Shift />
    } else if (this.props.pageOption === 'RECIPES') {
      return <Recipes />
    } else if (this.props.pageOption === 'INVERTORY') {
      return <Invoices globalSettings={this.props.globalSettings} />
    } else if (this.props.pageOption === 'STATISTIC') {
      return <Statistic />
    }
  }
}

export default PageBody