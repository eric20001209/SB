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
        public IActionResult GetInvoice([FromQuery] int? branch, [FromQuery] DateTime start, [FromQuery] DateTime end, [FromQuery] int? invoiceNumber)
        {
            var myfilter = new FilterDto();
            myfilter.BranchId = branch;
            myfilter.Start = start;
            myfilter.End = end;

            var myinovices = getInvoices(myfilter, invoiceNumber);
            return Ok(myinovices);
        }

        List<InvoiceDto> getInvoices(FilterDto myfilter, [FromQuery] int? invoiceNumber)
        {
            //create returnlist
            List<InvoiceDto> InvoicesToReturn = new List<InvoiceDto>();

            //get entities
            var myInvoices = _reporsitory.GetInvoices()
                .Where(i => myfilter.BranchId.HasValue ? i.Branch == myfilter.BranchId : true)
                .Where(i => myfilter.Start != null ? i.CommitDate >= myfilter.Start : true)
                .Where(i => myfilter.End != null ? i.CommitDate <= myfilter.End : true)
                .Where(i => invoiceNumber.HasValue ? i.InvoiceNumber == invoiceNumber : true)
                .ToList();

            //mapping entities to returnlist
            myInvoices.ForEach(i => InvoicesToReturn.Add(new InvoiceDto
            {
                inovice_number = i.InvoiceNumber,
                tax = i.Tax,
                commit_date = i.CommitDate,
                total = i.Total,
                //payment = new List<PaymentReportDto> { }
            }));

            return InvoicesToReturn;
        }
   
    }
}