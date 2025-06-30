const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    stock_name: { type: String, required: true },
    company_name: { type: String, required: true },
    sector: { type: String },
    open: { type: Number, required: true },
    upper_circuit: { type: Number, required: true },
    lower_circuit: { type: Number, required: true },
    qty: { type: Number, required: true },
    market_cap: { type: Number }, 
    pe_ratio: { type: Number },
    dividend_yield: { type: Number }, 
    about: { type: String },
    headquarters: { type: String },
    ceo: { type: String },
    founded_year: { type: Number },
    logo_url: { type: String },
    website: { type: String },
    stock_exchange: { type: String },
    currency: { type: String, default: 'USD' },
    last_circuit_update: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Stock', stockSchema);
