const {Schema, model } = require('mongoose');

const taskSchema = new Schema({
    id: {
        type: Number,
        unique: true
    },
    ten: {
        type: String
    },
    lop: {
        type: String
    },
    gioitinh: {
        type: Boolean
    },
    khoa: {
        type: String
    },
    ngaysinh: {
        type: Date
    },
    ngaynhaphoc: {
        type: Date
    }
})

module.exports = model('Task', taskSchema);