using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SB.Models;
using SB.Dto;

namespace SB.Services
{
    public interface IInvoicePaymentReporsitory
    {
        IEnumerable<Invoice> GetInvoices();
        Invoice GetInvoice(int? invoice_number);
        IEnumerable<TranInvoice> GetPaymentsInfo(int? invoice_number);
        TranInvoice GetPaymentInfo(int? invoice_number, int? tran_id);

        EnumTable GetPaymentMethod(int? payment);
    }
}
