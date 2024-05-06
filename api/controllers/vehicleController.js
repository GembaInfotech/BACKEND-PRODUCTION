const bcrypt = require('bcryptjs');
const {createVehicle} = require ('../handlers/VehicleHandler/createVehicle')
const {deleteVehicle} = require('../handlers/VehicleHandler/deleteVehicle')
const {setVehicleDefault} = require('../handlers/VehicleHandler/setVehicleDefault')
const {updateVehicle} = require('../handlers/VehicleHandler/updateVehicle')
const {viewVehicleList} = require('../handlers/VehicleHandler/viewVehicleList')

exports.create_new_vehicle = async(req, res)=>{
    try {
        await createVehicle(req,res)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.view_vehicle_list = async(req, res)=>{
    try {
        console.log("hello");
        await viewVehicleList(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.set_vehicle_default = async(req, res)=>{
    try {
        await setVehicleDefault(req,res)
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); 

    }
}

exports.update_vehicle = async(req, res)=>{
    try {
        await updateVehicle(req,res)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server errorr' }); 

    }
}

exports.delete_vehicle = async(req, res)=>{
    try {
        await deleteVehicle(req, res);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' }); 
    }
}





