using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SB.Data;
using SB.Dto;
using SB.Models;
using SB.Services;
using Microsoft.EntityFrameworkCore;

namespace SB.Services
{
    public class InvoicePaymentReporsitory : IInvoicePaymentReporsitory
    {
        private readonly wucha_cloudContext _context;
        public InvoicePaymentReporsitory(wucha_cloudContext context) //dependancy injection
        {
            _context = context;
        }

        IEnumerable<Invoice> IInvoicePaymentReporsitory.GetInvoices()
        {
            return _context.Invoice
                .Include(i => i.tranInvoice)
                .ToList();
        }

        public Invoice GetInvoice(int? invoice_number)
        {
            return _context.Invoice
                .Include(i=>i.tranInvoice)
                .Where(i => i.InvoiceNumber == invoice_number).FirstOrDefault()
                
                ;

            //throw new NotImplementedException();
        }

        public IEnumerable<TranInvoice> GetPaymentsInfo(int? invoice_number)
        {
            return _context.TranInvoice.Where(ti => ti.invoice_number == invoice_number).ToList();
        }

        public TranInvoice GetPaymentInfo(int? invoice_number, int? tran_id)
        {
            return _context.TranInvoice
                .Where(ti => ti.invoice_number == invoice_number && ti.TranId == tran_id).FirstOrDefault();
        }


    }
}
