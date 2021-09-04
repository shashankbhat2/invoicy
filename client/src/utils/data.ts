import { ItemLine, Invoice } from "../interfaces/invoice";

export const initialItemLine: ItemLine = {
    itemName: "",
    itemQuantity: 0,
    itemRate: 0,
    Amount: 0,
};


export const initialInvoice: Invoice = {
    logo: "",
    invoiceNumber: 0,
    companyAddress: "",
    companyAddress2: "",
    companyState: "",
    clientAddress: "",
    clientAddress2: "",
    clientState: "",
    invoiceDate: "",
    invoiceDueDate: "",
    items: [],
    invoiceSubtotal: 0,
    invoiceTotal: 0,
    invoiceTax: 0,
};
