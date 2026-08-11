import React, { useEffect, useState } from "react"
import Navigation from "./../components/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, User, Clock, CheckCircle, ThumbsUp, X } from "lucide-react"

export default function ForumPage() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [newTitle, setNewTitle] = useState("")
  const [newBody, setNewBody] = useState("")
  const [posting, setPosting] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [answerText, setAnswerText] = useState("")
  const [answerLoading, setAnswerLoading] = useState(false)
  const [topics, setTopics] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])

  useEffect(() => {
    // Load questions and topics
    Promise.all([
      fetch("https://mwanafunzi-hub-backend.onrender.com/api/questions").then(r => r.json()),
      fetch("https://mwanafunzi-hub-backend.onrender.com/api/topics").then(r => r.json())
    ]).then(([questionsData, topicsData]) => {
      setQuestions(questionsData)
      setTopics(topicsData)
      setLoading(false)
    }).catch(() => {
      setError("Failed to load forum data.")
      setLoading(false)
    })
  }, [])

  const handleAskQuestion = async (e) => {
    e.preventDefault()
    setPosting(true)
    setError("")
    
    try {
      const res = await fetch("https://mwanafunzi-hub-backend.onrender.com/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title: newTitle,
          body: newBody,
          topicIds: selectedTopics.length > 0 ? selectedTopics : undefined
        }),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        const refreshRes = await fetch("https://mwanafunzi-hub-backend.onrender.com/api/questions")
        const refreshedQuestions = await refreshRes.json()
        setQuestions(refreshedQuestions)
        setNewTitle("")
        setNewBody("")
        setSelectedTopics([])
      } else {
        setError(data.error || "Failed to post question.")
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to post question.")
    }
    setPosting(false)
  }

  const handleSelectQuestion = async (question) => {
    const questionId = question.question_id || question.id
    setSelectedQuestion(question)
    setAnswerText("")
    setAnswerLoading(true)
    
    try {
      const res = await fetch(`https://mwanafunzi-hub-backend.onrender.com/api/questions/${questionId}`)
      const questionData = await res.json()
      if (res.ok) {
        setSelectedQuestion(questionData)
      } else {
        setSelectedQuestion({ ...question, answers: [] })
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setSelectedQuestion({ ...question, answers: [] })
    }
    setAnswerLoading(false)
  }

  const handlePostAnswer = async (e) => {
    e.preventDefault()
    
    if (answerText.trim().length < 10) {
      setError("Answer must be at least 10 characters long.")
      return
    }
    
    setAnswerLoading(true)
    setError("")
    
    const payload = {
      question_id: selectedQuestion.question_id || selectedQuestion.id,
      body: answerText.trim(),
    }
    
    try {
      const res = await fetch("https://mwanafunzi-hub-backend.onrender.com/api/answers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      })
      
      const data = await res.json()
      
      if (res.ok) {
        const questionId = selectedQuestion.question_id || selectedQuestion.id
        const refreshRes = await fetch(`https://mwanafunzi-hub.onrender.com/api/questions/${questionId}`)
        const refreshedQuestion = await refreshRes.json()
        setSelectedQuestion(refreshedQuestion)
        setAnswerText("")
      } else {
        setError(data.error || "Failed to post answer.")
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to post answer.")
    }
    setAnswerLoading(false)
  }

  const toggleTopic = (topicId) => {
    setSelectedTopics(prev => 
      prev.includes(topicId) 
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navigation />
      
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Community Forum
          </h1>
          <p className="text-muted-foreground text-lg">
            Ask questions, share knowledge, and collaborate with peers
          </p>
        </div>

        {/* Ask Question Card */}
        <Card className="mb-8 border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Ask a Question
            </CardTitle>
            <CardDescription>Share your question with the community</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleAskQuestion} className="space-y-4">
              <div>
                <Input
                  placeholder="What's your question?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>
              
              <div>
                <Textarea
                  placeholder="Provide more details to help others answer your question..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  required
                  rows={5}
                  className="resize-none"
                />
              </div>

              {topics.length > 0 && (
                <div>
                  <label className="text-sm font-medium mb-2 block">Topics (optional)</label>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((topic) => (
                      <Badge
                        key={topic.id}
                        variant={selectedTopics.includes(topic.id) ? "default" : "outline"}
                        className="cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => toggleTopic(topic.id)}
                      >
                        {topic.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {error && <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-950 rounded-md">{error}</div>}
              
              <Button 
                type="submit" 
                disabled={posting || !newTitle.trim() || !newBody.trim()}
                className="w-full sm:w-auto"
                size="lg"
              >
                {posting ? "Posting..." : "Post Question"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Questions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading questions...</p>
          </div>
        ) : questions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">No questions yet</p>
              <p className="text-muted-foreground">Be the first to ask a question!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Recent Questions</h2>
            {questions.map((q) => (
              <Card 
                key={q.question_id || q.id} 
                className="cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-[1.01] border-l-4 border-l-blue-500"
                onClick={() => handleSelectQuestion(q)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 transition-colors">
                        {q.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {q.body}
                      </p>
                      
                      {q.topics && q.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {q.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span className="font-medium">{q.username || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(q.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-blue-600 font-medium">
                          <MessageSquare className="h-4 w-4" />
                          <span>{q.answer_count || 0} answers</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Question Details Modal */}
        {selectedQuestion && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-background rounded-lg shadow-2xl max-w-4xl w-full my-8">
              <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between rounded-t-lg">
                <h2 className="text-2xl font-bold">{selectedQuestion.title}</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedQuestion(null)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Question Body */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {(selectedQuestion.username || "A")[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{selectedQuestion.username || "Anonymous"}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(selectedQuestion.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="prose max-w-none whitespace-pre-wrap">
                      {selectedQuestion.body}
                    </div>
                  </CardContent>
                </Card>

                {/* Answer Form */}
                <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                  <CardHeader>
                    <CardTitle className="text-lg">Your Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePostAnswer} className="space-y-4">
                      <Textarea
                        placeholder="Share your knowledge... (minimum 10 characters)"
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        required
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {answerText.length}/10 characters
                        </span>
                        <Button 
                          type="submit" 
                          disabled={answerLoading || answerText.trim().length < 10}
                        >
                          {answerLoading ? "Posting..." : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Post Answer
                            </>
                          )}
                        </Button>
                      </div>
                      {error && <div className="text-red-500 text-sm p-3 bg-red-50 dark:bg-red-950 rounded-md">{error}</div>}
                    </form>
                  </CardContent>
                </Card>

                {/* Answers List */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {selectedQuestion.answers?.length || 0} Answers
                  </h3>
                  
                  {answerLoading && !selectedQuestion.answers ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                  ) : selectedQuestion.answers && selectedQuestion.answers.length > 0 ? (
                    <div className="space-y-4">
                      {selectedQuestion.answers.map((a) => (
                        <Card key={a.answer_id || a.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                                {(a.username || "A")[0].toUpperCase()}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-semibold">{a.username || "Anonymous"}</span>
                                  {a.is_accepted && (
                                    <Badge variant="default" className="bg-green-500">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Accepted
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {new Date(a.created_at).toLocaleString()}
                                </div>
                              </div>
                              {a.vote_score !== undefined && (
                                <div className="flex items-center gap-1 text-sm font-medium">
                                  <ThumbsUp className="h-4 w-4" />
                                  {a.vote_score}
                                </div>
                              )}
                            </div>
                            <div className="prose max-w-none whitespace-pre-wrap">
                              {a.body}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="text-center py-8">
                      <CardContent>
                        <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
                        <p className="text-muted-foreground">No answers yet. Be the first to help!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}