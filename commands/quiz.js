/**
 * @name Seoa:Quiz
 * @description Quiz command
 */

const QuizData = require('../QuizData/quizs.json')
const discord = require('discord.js')

exports.run = (seoa, msg, settings) => {
  let msgArray = msg.content.split(' ')
  let filter = (reaction, user) => (reaction.emoji.name === '⭕' || reaction.emoji.name === '❌') && user.id === msg.author.id

  /**
   * @type {number}
   */
  let quizNum
  if (!msgArray[1]) {
    quizNum = Math.floor(Math.random() * (QuizData.length - 1))
  } else {
    if (msgArray[1] < QuizData.length) {
      quizNum = Math.floor(msgArray[1])
    } else if ((QuizData.filter(quiz => quiz.language === msgArray[1])).length > 0) {
      let quizsFiltered = QuizData.filter(quiz => quiz.language === msgArray[1])
      quizNum = QuizData.indexOf(quizsFiltered[Math.floor(Math.random() * (quizsFiltered.length - 1))])
    } else {
      let quizNumberNotExist = new discord.RichEmbed()
        .setColor(0xff0000)
        .addField('퀴즈 No. ' + msgArray[1] + '(을)를 찾을 수 없습니다', '퀴즈는 No. ' + (QuizData.length - 1) + '까지만 존재합니다')
      return msg.channel.send(quizNumberNotExist)
    }
  }
  let quizEmbed = new discord.RichEmbed()
    .setColor(0x0000ff)
    .setAuthor(msg.author.username + '님이 Code Quiz를 풀고있습니다', msg.author.displayAvatarURL)
    .setTitle('Quiz No.' + quizNum)
    .addField('Q. ' + QuizData[quizNum].question.replace('{username}', msg.author.username), '제한시간 **1분**')
  if (QuizData[quizNum].image) {
    quizEmbed.setImage(QuizData[quizNum].image)
  }
  msg.channel.send(quizEmbed).then((th) => {
    if (Math.floor(Math.random() * 1)) {
      th.react('⭕')
      setTimeout(() => {
        th.react('❌')
      }, 1000)
    } else {
      th.react('❌')
      setTimeout(() => {
        th.react('⭕')
      }, 1000)
    }
    th.awaitReactions(filter, {
      time: 60000,
      max: 1
    }).then((collected) => {
      if (!collected) {
        let quizFailByLate = new discord.RichEmbed()
          .setColor(0x808080)
          .setDescription('[문제, 정답, 풀이 오류신고, 수정요청, 추가신청](https://github.com/PMHStudio/DiscordCodeQuizBot/issues/new/choose)')
          .setAuthor(msg.author.username + '님이 Code Quiz를 풀지못하셨습니다', msg.author.displayAvatarURL)
          .setTitle('Quiz No.' + quizNum)
          .addField('Q. ' + QuizData[quizNum].question.replace('{username}', msg.author.username), '**A.** ' + QuizData[quizNum].explanation)
        if (QuizData[quizNum].image) {
          quizFailByLate.setImage(QuizData[quizNum].image)
        }
        th.edit(quizFailByLate)
      } else {
        let QuizAwnser
        if (QuizData[quizNum].awnser === true) {
          QuizAwnser = '⭕'
        } else if (QuizData[quizNum].awnser === false) {
          QuizAwnser = '❌'
        }

        if (collected.array()[0].emoji.name === QuizAwnser) {
          let quizCorrectEmbed = new discord.RichEmbed()
            .setColor(0x00ff00)
            .setDescription('[문제, 정답, 풀이 오류신고, 수정요청, 추가신청](https://github.com/PMHStudio/DiscordCodeQuizBot/issues/new/choose)')
            .setAuthor(msg.author.username + '님이 Code Quiz를 맞추셨습니다!', msg.author.displayAvatarURL)
            .setTitle('Quiz No.' + quizNum)
            .addField('Q. ' + QuizData[quizNum].question.replace('{username}', msg.author.username), '**A.** ' + QuizData[quizNum].explanation)
          if (QuizData[quizNum].image) {
            quizCorrectEmbed.setImage(QuizData[quizNum].image)
          }
          th.edit(quizCorrectEmbed)
        } else {
          let quizNotCorrectEmbed = new discord.RichEmbed()
            .setColor(0xff0000)
            .setDescription('[문제, 정답, 풀이 오류신고, 수정요청, 추가신청](https://github.com/PMHStudio/DiscordCodeQuizBot/issues/new/choose)')
            .setAuthor(msg.author.username + '님이 Code Quiz를 풀지못하셨습니다', msg.author.displayAvatarURL)
            .setTitle('Quiz No.' + quizNum)
            .addField('Q. ' + QuizData[quizNum].question.replace('{username}', msg.author.username), '**A.** ' + QuizData[quizNum].explanation)
          if (QuizData[quizNum].image) {
            quizNotCorrectEmbed.setImage(QuizData[quizNum].image)
          }
          th.edit(quizNotCorrectEmbed)
        }
      }
    })
  })
}

exports.callSign = ['quiz', 'Quiz', '퀴즈']
exports.helps = {
    description: '도움말을 보여줍니다',
    uses: '>quiz'
}