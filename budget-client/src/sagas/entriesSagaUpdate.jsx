import axios from 'axios';
import {call, put, takeLatest} from 'redux-saga/effects';
import entriesTypes from '../actions/entries.actions';

export function* updateEntrySaga() {
    yield takeLatest(entriesTypes.UPDATE_ENTRY, updateEntryToDb);
}

function* updateEntryToDb({ payload }) {
    yield call(updateEntryDetails, payload);
}

async function updateEntryDetails(payload) {
    const { id, isExpense, value } = payload.entry;
    console.log("my updateEntryDetails:::",payload.entry);
    await axios.put(`http://localhost:3001/values/${id}`, {
        isExpense,
        value,
    });
}

