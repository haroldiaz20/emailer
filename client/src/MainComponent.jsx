import React, { Component } from 'react';

class MainComponent extends Component {
  render() {
    return (
      <div className="main-component">
        {this.props.children}
      </div>
    );
  }
}

export default MainComponent;