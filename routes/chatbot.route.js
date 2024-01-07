const express = require('express');
const { NlpManager } = require('node-nlp'); // NLP.js library

const adminauth = require("../middelwares/adminauth");
const UserModel = require('../models/user.model');
const app = express(express())
app.use(express.json())
require("dotenv").config()
const chatbotRoute = express.Router()
// Load the NLP manager
const manager = new NlpManager({ languages: ['en'] });

// Add named entities for extracting the name with variations


chatbotRoute.post('/query', async (req, res) => {
    let totaluser;
    try {
        totaluser = await UserModel.find()
        console.log("totaluser", totaluser)
    } catch (error) {
        console.log("error", error)
    }

    for (let i = 0; i < totaluser.length; i++) {
        const nameEntityName = totaluser[i].name.toLowerCase(); // Use lowercase name as entity name
        const nameVariations = [totaluser[i].name, ...getVariations(totaluser[i].name)]; // Add variations for the name



        manager.addNamedEntityText(
            nameEntityName,
            nameEntityName, // Use lowercase name as the entity value
            ['en'],
            nameVariations
        );
    }
    function getVariations(name) {
        const variations = [];
        variations.push(name); // Add the original name as a variation

        // Add variations with suffixes
        variations.push(name + 'esh');
        variations.push(name + 'eev');
        variations.push(name + 'on');

        // You can add more variations or use different techniques to generate variations her

        return variations;
    }
    // Train the manager with sample data
    manager.addDocument('en', 'Give me the information of [name]', 'user.query');
    manager.train();
    const { text } = req.query; // Assuming the user provides the input text as a query parameter
    try {
        const result = await manager.process('en', text);
        const extractedName = result.entities.find((entity) => entity.entity === 'name');

        if (extractedName) {
            console.log("extractedName", extractedName)
            const user = await UserModel.findOne({ name: extractedName.resolution.value });
            if (user) {
                // Check if the query contains 'address'
                if (text.includes('address')) {
                    // Format the bot response with the address information
                    const botResponse = `Sure, here is the address of ${user.name}, ${user.address}.`;
                    res.status(200).json({ response: botResponse });
                } else {
                    // Handle other queries here (if needed)
                    res.status(200).json({ response: 'I have other information about this user.' });
                }
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } else {
            res.status(400).json({ error: 'Name not extracted from input' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = {
    chatbotRoute
}







