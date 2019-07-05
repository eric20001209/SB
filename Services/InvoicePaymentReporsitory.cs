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

        IEnumerable<Invoice> IInvoicePaymentReporsitory.GetInvoices()
        {
            return _context.Invoice.ToList();
        }

        public IEnumerable<PaymentReportDto> GetPaymentInfo(int? invoice_number)
        {
            //return _context.TranInvoice.FirstOrDefault(ti => ti.InvoiceNumber == invoice_number)
            //    .ToString()
            //    .Join(
            //    _context.TranDetail.Select(td =>new { td.InvoiceNumber, td.Id}),

            //    );
        }
    }
}
