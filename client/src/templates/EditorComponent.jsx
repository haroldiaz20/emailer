import React, { Component } from 'react';

import { Editor } from 'react-draft-wysiwyg';

import './react-draft-wysiwyg.css';


class EditorComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editorContent: this.props.editorContentP,
            contentState: this.props.contentStateP,
            editorState: this.props.editorStateP,
        };
        this.uploadCallback = this.uploadCallback.bind(this);
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
        this.onEditorChange = this.onEditorChange.bind(this);
    }

    onEditorStateChange(editorState) {
        this.props.onHandleEditorState(editorState);
    }

    onEditorChange(editorContent) {
        this.props.onHandleEditorContent(editorContent);
    }

    uploadCallback(file) {
        // Recibimos la promesa que se rtorna al llamar a esta funcion
        return this.props.onImagesUpload(file).then(function(urlFinal){
            return {data: {link: urlFinal}};
        });
    }

    render() {
        return (
                <Editor 
                    placeholder="Write your message..."
                    wrapperClassName="home-wrapper"
                    editorClassName="home-editor" 
                    toolbar={{image: {uploadCallback: this.uploadCallback}}}
                    onEditorStateChange={this.onEditorStateChange}
                    onContentStateChange={this.onEditorChange}
                    />
                );
    }

}

export default EditorComponent;
