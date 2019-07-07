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
            //create returnlist
            List<InvoiceWithPaymentDto> InvoicesToReturn = new List<InvoiceWithPaymentDto>();

            //get entities
            var myInvoices = _reporsitory.GetInvoices()
                .Where(i => myfilter.BranchId.HasValue ? i.branch == myfilter.BranchId : true)
                .Where(i => myfilter.Start != null ? i.commit_date >= myfilter.Start : true)
                .Where(i => myfilter.End != null ? i.commit_date <= myfilter.End : true)
                .Where(i => invoiceNumber.HasValue ? i.inovice_number == invoiceNumber : true)
                .Select(i=>new  { i.inovice_number, i.tax,i.commit_date,i.total, i.branch}).ToList();

            //var Invoices = new InvoiceWithPaymentDto
            //{
            //    branch = myInvoices.,
            //    inovice_number = i.inovice_number,
            //    tax = i.tax,
            //    commit_date = i.commit_date,
            //    total = i.total
            //}

            //mapping entities to returnlist
            myInvoices.ForEach(i => InvoicesToReturn.Add(new InvoiceWithPaymentDto
            {
                branch = i.branch,
                inovice_number = i.inovice_number,
                tax = i.tax,
                commit_date = i.commit_date,
                total = i.total,
                payment = _reporsitory.GetPaymentInfo(i.inovice_number).ToList()
            }
            ));





            return InvoicesToReturn;
        }
   
    }
}