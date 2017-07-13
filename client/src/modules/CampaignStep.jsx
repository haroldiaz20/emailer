import React from 'react';
import {
Step,
        Stepper,
        StepLabel,
        } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import Snackbar from 'material-ui/Snackbar';

import CampaignStep1 from './CampaignStep1.jsx';
import CampaignStep2 from './CampaignStep2.jsx';
import CampaignStep3 from './CampaignStep3.jsx';

import config from '../config';


class CampaignStep extends React.Component {

    state = {
        campaign: {
            name: '',
            description: '',
            subject: '',
            friendly: '',
            body: '',
        },
        btn: 0,
        loading: false,
        finished: false,
        stepIndex: 0,
        arrayVariables: [],
        arrayLists: [],
        arrayProducts: [],
        imagesArray: [],
        alert: {
            message: '',
            open: false
        }
    };

    componentDidMount() {
        console.log('estas son las listas');
    }

    saveCampaign() {
        //alert('has terminado  desde la llamada a async funciton'); return;
        var token = localStorage.getItem("datatoken");

        var listas = []
        if (this.state.arrayLists.length > 0) {
            for (var x in this.state.arrayLists) {
                listas.push(this.state.arrayLists[x].value);
            }

        }
        var urlFinal = config.apiRoot + '/mailer/api/campaign';
        return fetch(urlFinal, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'x-access-token': token,
            },
            body: JSON.stringify({
                name: this.state.campaign.name,
                subject: this.state.campaign.subject,
                friendly: this.state.campaign.friendly,
                description: this.state.campaign.description,
                body: this.state.campaign.body,
                products: this.state.arrayProducts,
                lists: listas,
            })
        }).then((response) => response.json()).then((responseJson) => {
            console.log(responseJson);
            if (responseJson.success === true) {
                this.setState({alert: {message: responseJson.message, open: true}});
                return true;
            } else {
                this.setState({alert: {message: responseJson.message, open: true}});
                return false;
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    handleCloseMessage() {
        this.setState({alert: {message: '', open: false}});
    }

    dummyAsync = (cb) => {
        this.setState({loading: true}, () => {
            if (this.state.btn == 2) {
                console.log('este es el step: ' + this.state.stepIndex);
                console.log('este es el finished: ' + this.state.finished);
                if (this.state.stepIndex == 2) {
                    var _this = this;
                    this.saveCampaign().then(function (rpta) {
                        if (rpta) {
                            _this.asyncTimer = setTimeout(cb, 500);
                        } else {
                            const {stepIndex} = _this.state;
                            alert('hubo un error creando la campaign');
                            _this.setState({
                                loading: false,
                                stepIndex: stepIndex,
                            });
                        }
                    });
                } else {
                    this.asyncTimer = setTimeout(cb, 500);
                }
            } else {
                this.asyncTimer = setTimeout(cb, 500);
            }


        });
    }
    ;
            handleNext = () => {
        this.setState({btn: 2});
        const {stepIndex} = this.state;
        if (!this.state.loading) {
            this.dummyAsync((rpta) =>
                this.setState({
                    loading: false,
                    stepIndex: stepIndex + 1,
                    finished: stepIndex >= 2,
                }));
        }
    }
    ;
            handlePrev = () => {
        this.setState({btn: 1});
        const {stepIndex} = this.state;
        if (!this.state.loading) {
            this.dummyAsync(() => this.setState({
                    loading: false,
                    stepIndex: stepIndex - 1,
                }));
        }
    }
    ;
            handleCampaign = (campaign) => {
        this.setState({
            campaign: campaign,
        });

        //console.log(this.state.campaign);
    }
    ;
            handleListsSelect = (lists) => {
        //console.log('ya las tengo!!');
        //console.log(lists);
        this.setState({
            arrayLists: lists,
        });
    }
    ;
            handleListsUnselect = (lists) => {
        //console.log('se me fueron!!');
        //console.log(lists);
        this.setState({
            arrayLists: lists,
        });
    }
    ;
            handleOnProductChecked = (productos) => {
        this.setState({
            arrayProducts: productos,
        });

        console.log(this.state.arrayProducts);
    }
    ;
            handleOnImagesLoad = (images) => {
        this.setState({
            imagesArray: images,
        })
    }
    ;
            handleOnArrayVariablesChange = (variables) => {
        this.setState({
            arrayVariables: variables,
        })
        console.log(this.state.arrayVariables);
    }
    ;
            getStepContent(stepIndex) {
        switch (stepIndex) {
            case 0:
                return (
                        <div>
                        
                            <CampaignStep1 campaignSettings={this.state.campaign} 
                                           onCampaignChange={this.handleCampaign}/>
                        </div>

                        );
            case 1:
                return (
                        <div>
                        
                            <CampaignStep2 onImagesLoad={this.handleOnImagesLoad} imagesArray={this.state.imagesArray} onListSelect={this.handleListsSelect} arrayVariables={this.state.arrayVariables} handleOnVariablesChange={this.handleOnArrayVariablesChange}
                                           onListUnselect={this.handleListsUnselect} arraylists={this.state.arrayLists} 
                                           arrayProductos={this.state.arrayProducts} onProductChecked={this.handleOnProductChecked} />
                        
                        </div>
                        );
            case 2:
                return (
                        <div>
                            <CampaignStep3  
                                campaignSettings={this.state.campaign} imagesArray={this.state.imagesArray} onCampaignChange={this.handleCampaign} arrayVariables={this.state.arrayVariables}/>
                        </div>

                        );
            default:
                return 'You\'re a long way from home sonny jim!';
        }
    }

    renderContent() {
        const {finished, stepIndex} = this.state;
        const contentStyle = {margin: '0 16px', overflow: 'hidden'};

        if (finished) {
            return (
                    <div style={contentStyle}>
                        <p>
                            <a
                                href="#"
                                onClick={(event) => {
                                        event.preventDefault();
                                        this.setState({stepIndex: 0, finished: false, campaign: {}, arrayLists: [],
                                            arrayProducts: [], });
                                    }}
                                >
                                Click here
                            </a> to reset the example.
                        </p>
                    </div>
                    );
        }

        return (
                <div style={contentStyle}>
                    <div>{this.getStepContent(stepIndex)}</div>
                    <div style={{marginTop: 24, marginBottom: 12}}>
                        <FlatButton
                            label="Back"
                            disabled={stepIndex === 0}
                            onTouchTap={this.handlePrev}
                            style={{marginRight: 12}}
                            />
                        <RaisedButton
                            label={stepIndex === 2 ? 'Finish' : 'Next'}
                            primary={true}
                            onTouchTap={this.handleNext}
                            />
                    </div>
                </div>
                );
    }

    render() {
        const {loading, stepIndex} = this.state;

        return (
                <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
                    <Stepper activeStep={stepIndex}>
                        <Step>
                            <StepLabel>Set campaign settings</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Select email list and products</StepLabel>
                        </Step>
                        <Step>
                            <StepLabel>Create your template</StepLabel>
                        </Step>
                    </Stepper>
                    <ExpandTransition loading={loading} open={true}>
                        {this.renderContent()}
                    </ExpandTransition>
                    <Snackbar
                        open={this.state.alert.open}
                        message={this.state.alert.message}
                        autoHideDuration={4000}     
                        onRequestClose={this.handleCloseMessage}     
                        />   
                </div>
                );
    }
}

export default CampaignStep;