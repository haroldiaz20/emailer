import React from 'react';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Checkbox from 'material-ui/Checkbox';

// Configurtion file
import config from '../config';
/**
 * An example of rendering multiple Chips from an array of values. Deleting a chip removes it from the array.
 * Note that since no `onTouchTap` property is defined, the Chip can be focused, but does not gain depth
 * while clicked or touched.
 */
class CampaignProductsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {selectedImages:[], arrayVars: []};
    this.isProductChecked = this.isProductChecked.bind(this);
    this.handleProductOnCheck = this.handleProductOnCheck.bind(this);
    this.findIndice = this.findIndice.bind(this);
    this.agregarVariables = this.agregarVariables.bind(this);
  }

  componentDidMount(){
    this.cargarImagenes();
    this.setState({selectedImages: this.props.arrayProductos, arrayVars: this.props.arrayVariables});
  }

  cargarImagenes(){
    var token = localStorage.getItem("datatoken");
    var urlFetch = config.apiRoot + '/products';
     return fetch(urlFetch,{
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'x-access-token' : token
          }})
          .then((response) => response.json())
          .then((responseJson) => {
           if(responseJson.success === true){              
              
              var images = responseJson.data.map(function(item, i){

                  return {
                    value: item.value, 
                    img: '/images/' + item.path, 
                    title: item.name, 
                    author: item.name
                  };
                  
              });
              
              this.props.handleImages(images);           
              
           }           
            
          })
          .catch((error) => {
            console.error(error);
          });
  }


  handleProductOnCheck(ev, isChecked){
    var value = ev.target.name;   
    var arrayelements = this.state.selectedImages;
 

    if(isChecked === true){     
      arrayelements.push(value);

    }else{
        
      const productToDelete = arrayelements.indexOf(value);
      arrayelements.splice(productToDelete, 1);

    }

    this.agregarVariables(value, isChecked);


    this.setState({selectedImages: arrayelements,});
    this.props.onProductCheck(arrayelements);
    //this.props.handleVariablesArray([]);
    
  }

  agregarVariables(value, blnChecked){

    var variable;
    var variables = this.props.arrayVariables;
    var imagesArray = this.props.imagesArray;
     // indice del elemento imagen traido desde el servidor según la imagen escogida
   // var indiceValue = this.findIndice(this.props.imagesArray, value);
    var indiceValue = imagesArray.findIndex(x => x.value===value);
    
    console.log(imagesArray);
    console.log(value);
    console.log('este es el indice: '+indiceValue);
    if(indiceValue > -1){

      variable = {
          value: value,
          name: imagesArray[indiceValue].title,
          link_product: '{{link_'+ value + '}}',
          img_product: '{{img_'+ value + '}}',
          url: imagesArray[indiceValue].img,
      };

      if(blnChecked === true){
          variables.push(variable);
      }else{
          const productToDelete = variables.findIndex(x => x.value===value);
          if(productToDelete > -1){
            variables.splice(productToDelete, 1);  
          }
          
      }
    }
    this.setState({arrayVars: variables,});
    this.props.handleVariablesArray(variables);

  }

  findIndice(arreglo, value){

      for(var i = 0; i < arreglo.length; i++){
        if(arreglo[i].value === value){
          return i;
        }else{
          return -1;
        }
      }

      
  }

  isProductChecked(val){
      var arrayprod = this.state.selectedImages;      
     
      if(arrayprod.length > 0){
        var indice = arrayprod.indexOf(val);
        if(indice > -1){
          return true;
        }else{
          return false;
        }
      } 

  }

  render() {
    const styles = {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
      },
      gridList: {
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
      },
      titleStyle: {
        color: 'rgb(0, 188, 212)',
      },
      checkbox: {

      },
    };
    return (
<div style={styles.root}>
    <GridList style={styles.gridList} cols={2.2}>
        {this.props.imagesArray.map((tile) => (
        <GridTile
            key={tile.value}
            title={tile.title}
            actionIcon={ <IconButton><Checkbox name={tile.value} checked={this.isProductChecked(tile.value)}
                                           label="" 
                                           onCheck={this.handleProductOnCheck}
                                           style={styles.checkbox}
                                           /></IconButton>}
                titleStyle={styles.titleStyle}
                titleBackground="linear-gradient(to top, rgba(0,0,0,0.701961) 0%,rgba(0,0,0,0.3) 70%,rgba(0,0,0,0.05) 100%)"
              >
            <img src={tile.img} role="presentation"/>
        </GridTile>
            ))}
    </GridList>
</div>
    );
}
}

export default CampaignProductsList;