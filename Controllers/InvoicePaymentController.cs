using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SB.Services;
using SB.Dto;

namespace SB.Controllers
{
    [Route("api/invoicePayment")]
    [ApiController]
    public class InvoicePaymentController : ControllerBase
    {
        private readonly IInvoicePaymentReporsitory _reporsitory;
        public InvoicePaymentController(IInvoicePaymentReporsitory reporsitory)
        {
            _reporsitory = reporsitory;
        }

        [HttpGet()]
        public IActionResult GetInvoices([FromQuery] int? branch, [FromQuery] DateTime start, [FromQuery] DateTime end, [FromQuery] int? invoiceNumber)
        {
            var myfilter = new FilterDto();
            myfilter.BranchId = branch;
            myfilter.Start = start;
            myfilter.End = end;

            var myinovices = getInvoices(myfilter, invoiceNumber);
            return Ok(myinovices);
        }

        List<InvoiceWithPaymentDto> getInvoices(FilterDto myfilter, [FromQuery] int? invoiceNumber)
        {
            //get entities without payment
            var myInvoices = _reporsitory.GetInvoices()
                .Where(i => myfilter.BranchId.HasValue ? i.Branch == myfilter.BranchId : true)
                .Where(i => myfilter.Start != null ? i.CommitDate >= myfilter.Start : true)
                .Where(i => myfilter.End != null ? i.CommitDate <= myfilter.End : true)
                .Where(i => invoiceNumber.HasValue ? i.InvoiceNumber == invoiceNumber : true)
                .ToList();
            //create returnlist

            var InvoicesToReturn = new List<InvoiceWithPaymentDto>();

            foreach (var i in myInvoices)
            {
                var invoiceToReturn = new InvoiceWithPaymentDto
                {
                    branch = i.Branch,
                    inovice_number = i.InvoiceNumber,
                    tax = i.Tax,
                    commit_date = i.CommitDate,
                    total = i.Total
                };
                i.tranInvoice.ToList().ForEach(ti => invoiceToReturn.payment.Add(new PaymentReportDto
                {
                    payment_method = ti.payment_method.ToString(),
                    amount = ti.AmountApplied
                })); 

                InvoicesToReturn.Add(invoiceToReturn);
            }

            return InvoicesToReturn;
        }
   
    }
}