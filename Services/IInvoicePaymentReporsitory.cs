using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SB.Models;

namespace SB.Services
{
    public interface IInvoicePaymentReporsitory
    {
        IEnumerable<Invoice> GetInvoices();
        Invoice GetInvoice(int invoice_number);
    }
}
