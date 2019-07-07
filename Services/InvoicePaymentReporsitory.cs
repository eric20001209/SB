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

        IEnumerable<InvoiceWithPaymentDto> IInvoicePaymentReporsitory.GetInvoices()
        {
            return _context.Invoice
                .Select(i => new InvoiceWithPaymentDto { branch = i.Branch, inovice_number = i.InvoiceNumber, tax = i.Tax, total = i.Total, commit_date = i.CommitDate })
                .ToList();
        }

        public InvoiceWithPaymentDto GetInvoice(int? invoice_number)
        {
            return _context.Invoice.Where(i => i.InvoiceNumber == invoice_number)
                .Select(i => new InvoiceWithPaymentDto { branch = i.Branch, inovice_number = i.InvoiceNumber, tax = i.Tax, total = i.Total, commit_date = i.CommitDate }).FirstOrDefault()
                ;

            //throw new NotImplementedException();
        }

        public IEnumerable<PaymentReportDto> GetPaymentInfo(int? invoice_number)
        {
            var returnlist = from ti in _context.TranInvoice
                             where ti.InvoiceNumber == invoice_number
                             join td in _context.TranDetail
                             on ti.TranId equals td.Id
                             //join e in _context.EnumTable
                             //on td.PaymentMethod equals e.Id
                             //where e.Class == "payment_method"

                             select new PaymentReportDto { payment_method = td.PaymentMethod.ToString(), amount = ti.AmountApplied };
            return returnlist;
        }


    }
}
