export interface Invoice{
    logo: string
    invoiceNumber: number
    companyAddress: string
    companyAddress2: string
    companyState: string
    clientAddress: string
    clientAddress2: string
    clientState: string
    invoiceDate: string
    invoiceDueDate: string
    items: ItemLine[],
    invoiceTotal: number,
    invoiceSubtotal: number,
    invoiceTax:number,
}

export interface ItemLine{
    itemName: string
    itemQuantity: number,
    itemRate: number,
    Amount: number
}