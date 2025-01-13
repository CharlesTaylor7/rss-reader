using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RssReader.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_blogs_Users_UserId",
                table: "blogs");

            migrationBuilder.DropForeignKey(
                name: "FK_posts_Users_UserId",
                table: "posts");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "posts",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "blogs",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddForeignKey(
                name: "FK_blogs_Users_UserId",
                table: "blogs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_posts_Users_UserId",
                table: "posts",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_blogs_Users_UserId",
                table: "blogs");

            migrationBuilder.DropForeignKey(
                name: "FK_posts_Users_UserId",
                table: "posts");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "posts",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "blogs",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_blogs_Users_UserId",
                table: "blogs",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_posts_Users_UserId",
                table: "posts",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
