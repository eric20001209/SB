using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SB.Data;
using SB.Dto;
using SB.Models;

namespace SB.Services
{
    public class InvoicePaymentReporsitory : IInvoicePaymentReporsitory
    {
        private readonly wucha_cloudContext _context;
        public InvoicePaymentReporsitory(wucha_cloudContext context) //dependancy injection
        {
            _context = context;
        }

        Invoice IInvoicePaymentReporsitory.GetInvoice(int invoice_number)
        {
            return _context.Invoice.FirstOrDefault(i => i.InvoiceNumber == invoice_number);
            //throw new NotImplementedException();
        }

        IEnumerable<Invoice> IInvoicePaymentReporsitory.GetInvoices()
        {
            return _context.Invoice.ToList();
            //throw new NotImplementedException();
        }
    }
}
