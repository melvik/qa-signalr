using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace server.Hubs
{
    public class QuestionHub: Hub<IQuestionHub>
    {
        private readonly ILogger _logger;

        public QuestionHub(ILogger<QuestionHub> logger)
        {
            _logger = logger;
        }

        // These 2 methods will be called from the client
        public async Task JoinQuestionGroup(Guid questionId)
        {
            this._logger.LogInformation($"Client_ {Context.ConnectionId} is viewing {questionId}");

            await Groups.AddToGroupAsync(Context.ConnectionId, questionId.ToString());
        }
        public async Task LeaveQuestionGroup(Guid questionId)
        {
            this._logger.LogInformation($"Client {Context.ConnectionId} LEFT viewing {questionId}");
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, questionId.ToString());

        }
    }
}