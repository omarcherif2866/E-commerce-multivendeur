// export default class Reservation {
//     constructor(idp, idc, id, date){
//         this.idp = idp;
//         this.idc = idc;
//         this.id = id;
//         this.date = date;

//     }
// }

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const reservationSchema = new Schema(
    {
        idp: {
            type: String,
            required: true
        },
        idc: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true
    }
);

export default model('REservation', reservationSchema);