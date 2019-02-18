using System;
using System.Threading.Tasks;
using server.Models;

namespace server.Hubs
{
    public interface IQuestionHub
    {
        Task QuestionScoreChange(Guid questionId, int score);
        Task AnswerCountChange(Guid questionId, int answerCount);
        Task AnswerAdded(Answer answer);
    }
}