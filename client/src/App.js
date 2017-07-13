import React, { Component } from 'react';


import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

//import ContainerComponent from './ContainerComponent.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';

import NavbarComponent from './NavbarComponent.jsx';
import SidebarComponent from './SidebarComponent.jsx';
import MainComponent from './MainComponent.jsx';

import './App.css';

injectTapEventPlugin();

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {statusDrawer: true, width: 0, height: 0, statusDocked: false,
            publicDns: "ec2-35-166-109-87.us-west-2.compute.amazonaws.com"};
        this.changeStatusDrawer = this.changeStatusDrawer.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    /**
     * Calculate & Update state of new dimensions
     */
    updateDimensions() {
        if (window.innerWidth < 1024) {
            this.setState({statusDrawer: false, statusDocked: false, width: 450, height: 102});
        } else {
            let update_width = window.innerWidth - 100;
            let update_height = Math.round(update_width / 4.4);
            this.setState({statusDrawer: true, statusDocked: true, width: update_width, height: update_height});
        }
    }

    /**
     * Add event listener
     */
    componentDidMount() {

        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
    }

    /**
     * Remove event listener
     */
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    changeStatusDrawer(newStatus) {

        var ancho = this.state.width;
        if (ancho > 1024) {
            this.setState({statusDocked: true, statusDrawer: true});
        } else {
            this.setState({statusDrawer: newStatus, statusDocked: false});
        }

        //this.updateDimensions();
    }

    render() {
        const divStyle2 = {
            flex: '1', backgroundColor: '#edecec'
        };
        const divStyle1 = {
            display: 'flex', flexDirection: 'column', minHeight: '100vh'
        };

        return (
                <MuiThemeProvider>
                
                    <div style={divStyle1}>
                        <div className="body" style={divStyle2}>
                            <NavbarComponent onClickProp={this.changeStatusDrawer} statusDrawer={this.state.statusDrawer} />
                            <SidebarComponent {...this.props} status={this.state.statusDrawer} statusDocked={this.state.statusDocked} changeStatusDrawer={this.changeStatusDrawer}/>
                            <MainComponent publicDns={this.state.publicDns} >
                                {this.props.children}
                            </MainComponent>
                        </div>
                    </div> 
                
                </MuiThemeProvider>
                );
    }
}

export default App;
