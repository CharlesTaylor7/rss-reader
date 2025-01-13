using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RssReader.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUserFK2 : Migration
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

            migrationBuilder.DropIndex(
                name: "IX_posts_UserId",
                table: "posts");

            migrationBuilder.DropIndex(
                name: "IX_blogs_UserId",
                table: "blogs");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "posts");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "blogs");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "posts",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "blogs",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_posts_UserId",
                table: "posts",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_blogs_UserId",
                table: "blogs",
                column: "UserId");

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
    }
}
