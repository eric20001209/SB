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
        IEnumerable<PaymentReportDto> GetPaymentInfo(int? invoice_number);
    }
}
