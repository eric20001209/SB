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
        IEnumerable<InvoiceWithPaymentDto> GetInvoices();
        InvoiceWithPaymentDto GetInvoice(int? invoice_number);
        IEnumerable<PaymentReportDto> GetPaymentInfo(int? invoice_number);
    }
}
