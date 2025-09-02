const express = require('express');
const router = express.Router();
const {
  addClient,
  getClients,
  getClientById,
  updateClient,
  deleteClient
} = require('../../controller/api/ClientController');
const { Authcheck } = require('../../middleware/AuthCheck');

router.post('/', Authcheck , addClient);
router.get('/', Authcheck , getClients);
router.get('/:id', Authcheck , getClientById);
router.put('/:id', Authcheck , updateClient);
router.delete('/:id', Authcheck , deleteClient);

module.exports = router;
