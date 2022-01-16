import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'
import { IOrder, IItemStatus } from '../types/order'
import { ITransaction } from '../types/transaction'
import { parse, format } from 'date-fns'
import { createObjectCsvWriter } from 'csv-writer'
import { mapProvinceToTaxRate } from '../helpers/tax.helper'
import { IProvice } from '../types/province'

const parser = csv({ separator: '\t' })
const unitCost = 2.6
const fromDate = '2021-05-01'
const toDate = '2021-05-31'

const importPath = path.join(
  __dirname,
  `../imported__orders/${fromDate}___${toDate}.txt`
)

const ordersExportPath = path.join(
  __dirname,
  `../exported__transactions/orders_${fromDate}___${toDate}.csv`
)

const hstExportPath = path.join(
  __dirname,
  `../exported__transactions/hst_${fromDate}___${toDate}.csv`
)

const stockExportPath = path.join(
  __dirname,
  `../exported__transactions/stock_consumed_${fromDate}___${toDate}.csv`
)

const allOrders: IOrder[] = []
fs.createReadStream(importPath)
  .pipe(parser)
  .on('data', (data) => allOrders.push(data))
  .on('end', () => {
    const header = [
      { id: 'Description', title: 'Description' },
      { id: 'Date', title: 'Date' },
      { id: 'Credit', title: 'Credit' },
      { id: 'Debit', title: 'Debit' }
    ]
    const headerObj = {
      Description: 'Description',
      Date: 'Date',
      Credit: 'Credit',
      Debit: 'Debit'
    }
    const orders = allOrders.filter(
      (o) => o['item-status'] === IItemStatus.Shipped
    )

    // Orders
    const orderTransactionsWriter = createObjectCsvWriter({
      path: ordersExportPath,
      header
    })
    orderTransactionsWriter
      .writeRecords([...orders.map((o) => convertOrder(o))])
      .then(() => {
        console.log('Order Transactions Generated.')
      })

    // HST
    const hstTransactionWriter = createObjectCsvWriter({
      path: hstExportPath,
      header
    })

    hstTransactionWriter.writeRecords([...convertHst(orders)]).then(() => {
      console.log('HST Transactions Generated.')
    })

    // Stock
    const stockTransactionWriter = createObjectCsvWriter({
      path: stockExportPath,
      header
    })

    stockTransactionWriter.writeRecords([...convertStock(orders)]).then(() => {
      console.log('Stock Transactions Generated.')
    })
  })

const convertOrder = (order: IOrder): ITransaction => {
  const dateString = order['purchase-date'].slice(0, 10)

  return {
    Description: order['amazon-order-id'],
    Date: format(parse(dateString, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy'),
    Credit: String(
      (
        Number(order['item-price']) +
        Number(order['shipping-price']) -
        Number(order['item-promotion-discount']) -
        Number(order['ship-promotion-discount'])
      ).toFixed(2)
    ),
    Debit: ''
  }
}

const convertHst = (orders: IOrder[]): ITransaction[] => {
  return [
    {
      Description: `HST from [${fromDate}] to [${toDate}]`,
      Date: toDate,
      Credit: String(
        orders
          .filter((o) => o['ship-country'] === 'CA')
          .reduce((a, c) => {
            return (
              a +
              (Number(c['item-tax']) ||
                // Number(c['item-price']) *
                // (mapProvinceToTaxRate[c['ship-state'] as IProvice] || 0.13)
                0) +
              Number(c['shipping-tax'] + Number(c['gift-wrap-tax']))
            )
          }, 0)
          .toFixed(2)
      ),
      Debit: ''
    }
  ]
}

const convertStock = (orders: IOrder[]): ITransaction[] => {
  return [
    {
      Description: `Stock Consumed from [${fromDate}] to [${toDate}]`,
      Date: toDate,
      Debit: String(
        orders
          .reduce((a, c) => {
            return a + Number(c.quantity) * unitCost
          }, 0)
          .toFixed(2)
      ),
      Credit: ''
    }
  ]
}
