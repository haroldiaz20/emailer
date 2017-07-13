import React from 'react'

import NavbarComponent from './NavbarComponent.jsx';
import SidebarComponent from './SidebarComponent.jsx';
import MainComponent from './MainComponent.jsx';


class ContainerComponent extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {statusDrawer: true};
		this.changeStatusDrawer = this.changeStatusDrawer.bind(this);
	}

	changeStatusDrawer(newStatus) {
		console.log(newStatus); 
		this.setState({statusDrawer: newStatus});
	}
		
	render(){
		
		const divStyle1 = {
			display: 'flex', flexDirection: 'column', minHeight: '100vh'
		};
		
		return(
			<div style={divStyle1}>
                <div className="body">
                    <NavbarComponent onClickProp={this.changeStatusDrawer} />
                    <SidebarComponent status={this.state.statusDrawer}/>
					<MainComponent>{this.props.children}</MainComponent>
					
                </div>
            </div>
			
		);
	}
	

}

export default ContainerComponent;