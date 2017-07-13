import React from 'react'
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import CampaignListChip from './CampaignListChip.jsx';
import CampaignProductsList from './CampaignProductsList.jsx';

import config from '../config';

class CampaignStep2 extends React.Component {

    constructor(props) {
        super(props);
        this.state = {items: [], campaign: {}, value: 0, alert: {
                message: '',
                open: false
            }};
        this.handleOnUnselectChip = this.handleOnUnselectChip.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleOnProductCheck = this.handleOnProductCheck.bind(this);
        this.handleImagesArray = this.handleImagesArray.bind(this);
        this.handleVariablesChange = this.handleVariablesChange.bind(this);

    }

    componentDidMount() {
        var _this = this;
        this.getListasArray().then(function (listas) {
            _this.setState({items: listas});
        });
    }

    getListasArray() {
        var urlFetch = config.apiRoot + '/mailer/api/lists?enable=true';
        return fetch(urlFetch)
                .then((response) => response.json())
                .then((responseJson) => {
                    if (responseJson.success === true) {
                        var listas = responseJson.data.map(function (item, i) {
                           return <MenuItem name={item.value} value={item.value} key={i} primaryText={item.name} />;
                        });
                        return listas;
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
    }

    handleOnUnselectChip(listItems) {
        this.props.onListUnselect(listItems);

    }

    handleSelectChange(event, index, value) {
        //console.log('lista seleccted ' + value);
        var arrayData = this.props.arraylists;
        var newItem = {key: index, label: event.target.innerText, value: value, };
        var exists = false;
        arrayData.forEach(function (item) {
            if (item.key === index) {
                item.label = event.target.innerText;
                exists = true;
            }
        });


        if (exists !== true) {
            arrayData.push(newItem);
        }

        // llamamos a la propiedad el compoonente padre que se le pasó a este elemento
        this.props.onListSelect(arrayData);
        this.setState({value: value});
    }

    handleOnProductCheck(productos) {
        this.props.onProductChecked(productos);

    }

    handleImagesArray(images) {
        this.props.onImagesLoad(images);
    }

    handleVariablesChange(variables) {
        this.props.handleOnVariablesChange(variables);
    }

    render() {
        return (
                <div className="step2__campaign--wrapper">
                    <p>Choose one or multiple lists</p>
                    <SelectField
                        value={this.state.value}
                        onChange={this.handleSelectChange}
                        maxHeight={200}
                        floatingLabelText="Lists of emails"
                        >
                        {this.state.items}
                    </SelectField>
                    <CampaignListChip listsData={this.props.arraylists} onUnselect={this.handleOnUnselectChip}/>
                    <br />
                    <Divider />
                    <br />
                    <p>Choose your images for your campaign's template</p>
                    <CampaignProductsList handleImages={this.handleImagesArray} imagesArray={this.props.imagesArray}  arrayProductos={this.props.arrayProductos} onProductCheck={this.handleOnProductCheck}
                                          handleVariablesArray={this.handleVariablesChange} arrayVariables={this.props.arrayVariables}
                                          />
                </div>


                );
    }

}

export default CampaignStep2;