using Microsoft.EntityFrameworkCore.Migrations;

namespace SB.Migrations
{
    public partial class addFK : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
    name: "FK_tran_invoice_invoice_invoiceId",
    table: "tran_invoice",
    column: "invoiceId",
    principalTable: "invoice",
    principalColumn: "id",
    onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
