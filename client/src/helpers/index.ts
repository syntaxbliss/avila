import _ from 'lodash';
import {
  MaterialMeasureUnit,
  PaymentMethod,
  RequestForQuotationStatus,
} from '../__generated__/graphql';
import dayjs from 'dayjs';

export const materialMeasureUnitAbbreviationText: Record<MaterialMeasureUnit, string> = {
  [MaterialMeasureUnit.Gr]: 'gr',
  [MaterialMeasureUnit.Kg]: 'kg',
  [MaterialMeasureUnit.Tn]: 'tn',
  [MaterialMeasureUnit.Lt]: 'lt',
  [MaterialMeasureUnit.Mt]: 'mt',
  [MaterialMeasureUnit.Unit]: 'un',
};

export const paymentMethodText: Record<PaymentMethod, string> = {
  [PaymentMethod.BankTransfer]: 'Transferencia bancaria',
  [PaymentMethod.Cash]: 'Efectivo',
  [PaymentMethod.Check]: 'Cheque',
  [PaymentMethod.CurrentAccount]: 'Cuenta corriente',
  [PaymentMethod.ECheck]: 'E-Check',
};

export const requestForQuotationStatusText: Record<RequestForQuotationStatus, string> = {
  [RequestForQuotationStatus.Answered]: 'Contestado',
  [RequestForQuotationStatus.Cancelled]: 'Cancelado',
  [RequestForQuotationStatus.Unanswered]: 'Sin contestar',
};

const currencyFormatter = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' });

export const formatMaterialQuantity = (
  quantity: number | null | undefined,
  measureUnit: MaterialMeasureUnit
) => {
  if (_.isNull(quantity) || _.isUndefined(quantity)) {
    return null;
  }

  return `${currencyFormatter.format(quantity).substring(2)} ${
    materialMeasureUnitAbbreviationText[measureUnit]
  }`;
};

export const formatCurrency = (input: number) => currencyFormatter.format(input);

export const humanReadableDate = (input?: Date) => dayjs(input).format('DD/MM/YYYY');

export const calculatePurchaseOrderMaterialsTotalAmount = (
  materials: Array<{ quantity: number; unitPrice: number }>
): number => {
  const totalAmount = materials.reduce((sum, material) => {
    sum += material.quantity * material.unitPrice;

    return sum;
  }, 0);

  return Number(totalAmount.toFixed(2));
};

export const calculatePurchaseOrderPaymentsTotalPaid = (paidAmounts: number[]) => {
  const totalPaid = paidAmounts.reduce((sum, amount) => {
    sum += amount;

    return sum;
  }, 0);

  return Number(totalPaid.toFixed(2));
};
