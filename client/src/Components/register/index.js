import React, { useState } from 'react';
import { Container, Form, Button, Col } from 'react-bootstrap'

export default class Register extends React.Component {
    
    constructor(props) {
        super(props);
        this.state =  {
            user :"",
            email : "",
            password :"",
            adress : "",
            city: "",
            province: "",
            zip: "",
      }
    
        this.handleChange = this.handleChange.bind(this)
        this.onButtonClick =this.onButtonClick.bind(this)
        this.registerfunction=this.registerfunction.bind(this)


}

handleChange(event){
    event.preventDefault();
    var a = event.target.id;
    var b = event.target.value;
   
    this.setState({
      [a]: b
    });
}
registerfunction = function(user, email, password, adress, city, province, zip){
    return fetch('http://localhost:3001/users/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user, email, password, adress, city, province, zip })
        }
        )
            .then(response => response.json())
}

    
onButtonClick = async function (event) {
    event.preventDefault();
    var {user, email, password, adress, city, province, zip} = this.state;
    const response = await this.registerfunction(user ,email, password, adress, city, province, zip);
    console.log(response);
}



render () {
    {console.log(this.state)}
    return (
        
        <Container>
            

            <Form method='POST' action='http://localhost:3001/users/add'>
                <Form.Group controlId="formGridAName">
                    <Form.Label>Nombre Completo</Form.Label>
                    <Form.Control id="user" type="name" required onChange={this.handleChange}/>
                </Form.Group>
                 <Form.Row>
                    <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control id="email" type="email" placeholder="Enter email" name="email" required onChange={this.handleChange}/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control id="password" type="password" placeholder="Password" name="password" required onChange={this.handleChange}/>
                    </Form.Group>
                </Form.Row>

                <Form.Group controlId="formGridAddress1">
                    <Form.Label>Direccion</Form.Label>
                    <Form.Control id="adress" type="text"  onChange={(e)=>{this.setState({adress: e.target.value})}}/>
                </Form.Group>

              <Form.Row>
                    <Form.Group as={Col} controlId="formGridCity">
                        <Form.Label>Ciudad</Form.Label>
                        <Form.Control id="city" type="text" name="city" onChange={(e)=>{this.setState({city: e.target.value})}}/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridProv">
                        <Form.Label>Provincia</Form.Label>
                        <Form.Control id="province" type="text" name="province" onChange={(e)=>{this.setState({province: e.target.value})}}/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridZip">
                        <Form.Label>Codigo Postal</Form.Label>
                        <Form.Control id="zip"  type="number" name="zip" onChange={(e)=>{this.setState({zip: e.target.value})}}/>
                    </Form.Group>
                </Form.Row>



                <Button variant="primary" onClick={this.onButtonClick}>
                    Crear
                 </Button>
            </Form>
        </Container>
    )
}
}