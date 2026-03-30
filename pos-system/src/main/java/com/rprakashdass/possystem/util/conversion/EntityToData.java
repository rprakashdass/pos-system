package com.rprakashdass.possystem.util.conversion;

import com.rprakashdass.possystem.models.client.ClientData;
import com.rprakashdass.possystem.pojo.Client;

public class EntityToData {
    public static ClientData convertClientEntityToData(Client entity) {
        ClientData clientData = new ClientData();
        clientData.setName(entity.getName());
        clientData.setEmail(entity.getEmail());
        clientData.setPhoneNumber(entity.getPhoneNumber());
        return clientData;
    }
}
