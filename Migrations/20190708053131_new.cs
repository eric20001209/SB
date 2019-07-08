using Microsoft.EntityFrameworkCore.Migrations;

namespace SB.Migrations
{
    public partial class @new : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_tran_invoice_invoice_invoice_number",
                table: "tran_invoice",
                column: "invoice_number",
                principalTable: "invoice",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_tran_invoice_invoice_InvoiceId",
                table: "tran_invoice");

            migrationBuilder.AlterColumn<int>(
                name: "InvoiceId",
                table: "tran_invoice",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_tran_invoice_invoice_InvoiceId",
                table: "tran_invoice",
                column: "InvoiceId",
                principalTable: "invoice",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
