import { HubConnectionBuilder, LogLevel } from '@aspnet/signalr'

export default {
    install(Vue) {
        const connection = new HubConnectionBuilder()
            .withUrl(`${Vue.prototype.$http.defaults.baseURL}/question-hub`)
            .configureLogging(LogLevel.Information)
            .build()

        //.withUrl('http://localhost:5000/question-hub')

        const questionHub = new Vue() // use new Vue instance as an event bus

        // // every component will use this.$questionHub to access the event bus
        // Vue.prototype.$questionHub = questionHub

        // Forward server side SignalR events through $questionHub, where components will listen to them
        // Forward hub events through the event, so we can listen for them in the Vue components
        connection.on('QuestionScoreChange', (questionId, score) => {
            questionHub.$emit('score-changed', { questionId, score })
            console.log('Question Score Change')
        })
        connection.on('AnswerCountChange', (questionId, answerCount) => {
            questionHub.$emit('answer-count-changed', { questionId, answerCount })
        })
        connection.on('AnswerAdded', answer => {
            questionHub.$emit('answer-added', answer)
        })

        // Provide methods for components to send messages back to server
        // Make sure no invocation happens until the connection is established
        questionHub.questionOpened = (questionId) => {
            return startedPromise
            .then(() => connection.invoke('JoinQuestionGroup', questionId))
            .catch(console.error)
        }
        questionHub.questionClosed = (questionId) => {
            return startedPromise
            .then(() => connection.invoke('LeaveQuestionGroup', questionId))
            .catch(console.error)
        }
  
      // Add the hub to the Vue prototype, so every component can listen to events or send new events using this.$questionHub
      Vue.prototype.$questionHub = questionHub

        // connection.start()
        let startedPromise = null
        function start() {
            startedPromise = connection.start().catch(err => {
                console.error('Failed to connect with hub', err)
                return new Promise((resolve, reject) =>
                    setTimeout(() => start().then(resolve).catch(reject), 5000))
            })
            return startedPromise
        }
        connection.onclose(() => start())

        start()
    }
}