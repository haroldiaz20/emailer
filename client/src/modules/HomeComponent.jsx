import React from 'react'
import {Card, CardTitle, CardText} from 'material-ui/Card';
import { Grid, Row, Col } from 'react-flexbox-grid';


import  {LineChart, Line, BarChart, Bar, PieChart, Pie, Sector, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';

const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const SimpleLineChart = React.createClass({
	render () {
  	return (
  		
  			    <LineChart width={800} height={300} data={data}
		            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
		       <XAxis dataKey="name"/>
		       <YAxis/>
		       <CartesianGrid strokeDasharray="3 3"/>
		       <Tooltip/>
		       <Legend />
		       <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
		       <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
		      </LineChart>
  		

    );
  }
})



const data2 = [
      {name: 'Campaign A', undelivered: 4000, clicks: 2400, opens: 2400},
      {name: 'Campaign B', undelivered: 3000, clicks: 1398, opens: 2210},
      {name: 'Campaign C', undelivered: 2000, clicks: 9800, opens: 2290},
      {name: 'Campaign D', undelivered: 2780, clicks: 3908, opens: 2000},
      {name: 'Campaign E', undelivered: 1890, clicks: 4800, opens: 2181},
      {name: 'Campaign F', undelivered: 2390, clicks: 3800, opens: 2500},
      {name: 'Campaign G', undelivered: 3490, clicks: 4300, opens: 2100},
];

const StackedBarChart = React.createClass({
	render () {
  	return (
    	<BarChart width={500} height={300} data={data2}
            margin={{top: 20, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Bar dataKey="opens" stackId="a" fill="#8884d8" />
       <Bar dataKey="clicks" stackId="a" fill="#82ca9d" />
       <Bar dataKey="undelivered" fill="#ffc658"/>
      </BarChart>
    );
  }
})


// Pie Chart
const data3 = [{name: 'Males', value: 400}, {name: 'Females', value: 300},
                  {name: 'No Specified', value: 300},];
                   
const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`PV ${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`(Rate ${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const TwoLevelPieChart = React.createClass({
	getInitialState() {
    return {
      activeIndex: 0,
    };
  },

  onPieEnter(data, index) {
    this.setState({
      activeIndex: index,
    });
  },
	render () {
  	return (
    	<PieChart width={500} height={300} onMouseEnter={this.onPieEnter}>
        <Pie 
        	activeIndex={this.state.activeIndex}
          activeShape={renderActiveShape} 
          data={data3} 
          cx="50%" cy="40%"
          innerRadius={60}
          outerRadius={80} 
          fill="#8884d8"/>
       </PieChart>
    );
  }
})

class HomeComponent extends React.Component{
	
	constructor(props){
		super(props);
		this.state = {name: "Harold"};
	}
	
	render(){
		return(
			<Grid fluid style={{"marginTop": 30}}>
				<Row>
	          		<Col xs={12} md={9} mdOffset={3}>
	          			<Card>			   
						    <CardTitle title="Campaigns" subtitle="Campaigns behaviour" />
						    <CardText>
						    	<h3>This is the react graph using D3.js</h3>
						    	<SimpleLineChart />

						    </CardText>
						    
						</Card>	
	          		</Col>
	          	</Row>
	          	<Row fluid style={{"marginTop": 30}}>
	          		<Col xs={12} md={5} mdOffset={3}>
	          			<Card>
	          				<CardTitle title="Campaign Stadistics" subtitle="This is the emails statidistics for this month" />
	          				<CardText>
	          					<StackedBarChart />
	          				</CardText>
	          			</Card>

	          		</Col>

	          		<Col xs={12} md={4}>
	          			<Card>
	          				<CardTitle title="Customers clasification" subtitle="This graph shows your customers by its sex" />
	          				<CardText>
	          					<TwoLevelPieChart />
	          				</CardText>
	          			</Card>
	          		</Col>
	          	</Row>
	          	<Row fluid style={{"marginTop": 30}}>
	          	</Row>
			</Grid>
			
		);
	}
	

}

export default HomeComponent;