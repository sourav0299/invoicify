"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Search, Send, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
// import { useUserCheck } from "@/helper/useUserCheck"


const faqData = {
  general: [
    {
      question: "Hello",
      answer: "Hello, How can i assist you?",
    },
    {
      question: "Hi",
      answer: "Hello, how can i assist you?",
    },

    {
      question: "What is the purpose of this billing software?",
      answer:
        "This software automates billing processes for subscription-based services, streamlining invoicing and payment management.",
    },

    {
      question: "How do I create an account?",
      answer:
        'To create an account, go to our website and click on "Sign Up." Follow the prompts to enter your details and set up your account.',
    },
    {
      question: "What types of subscriptions can I manage with this software?",
      answer: "You can manage both subscription-based and usage-based services with our software.",
    },
  ],
  billing: [
    {
      question: "How do I generate an invoice?",
      answer:
        "Invoices are automatically generated based on your subscription settings. You can also manually create invoices if needed.",
    },
    {
      question: "Can I customize my invoice templates?",
      answer: "Yes, you can customize invoice templates to include your company branding and specific payment terms.",
    },
    {
      question: "How do I track overdue payments?",
      answer:
        "Use the dunning management feature to track and manage overdue payments. Automated reminders will be sent to customers.",
    },
  ],
  payment: [
    {
      question: "What payment methods are supported?",
      answer:
        "Our software supports various payment methods, including credit cards and direct debit through multiple payment gateways.",
    },
    {
      question: "How secure is payment processing?",
      answer:
        "Payment processing is secure and compliant with PCI-DSS standards to protect sensitive customer information.",
    },
    {
      question: "Can I retry failed payments automatically?",
      answer: "Yes, our software includes retry logic for failed payments to minimize revenue loss.",
    },
  ],
  analytics: [
    {
      question: "What types of reports can I generate?",
      answer:
        "You can generate reports on revenue metrics (MRR, ARR), customer churn rates, and ARPU (Average Revenue Per User).",
    },
    {
      question: "How do I access analytics insights?",
      answer:
        "Analytics insights are available through the dashboard. You can also export reports for further analysis.",
    },
  ],
  portal: [
    {
      question: "Can customers manage their subscriptions themselves?",
      answer:
        "Yes, customers can access their billing history, update payment methods, and manage subscriptions through the customer portal.",
    },
    {
      question: "How do I give customers access to the portal?",
      answer: "Customers are automatically granted access to the portal once their account is set up.",
    },
  ],
  integration: [
    {
      question: "Can I integrate this software with my existing CRM?",
      answer: "Yes, our software integrates seamlessly with popular CRM systems to ensure data consistency.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, our software adheres to GDPR and PCI-DSS compliance standards to ensure data security and privacy.",
    },
  ],
  troubleshooting: [
    {
      question: "What if I encounter an error while generating an invoice?",
      answer: "If you encounter an error, please contact our support team for assistance.",
    },
    {
      question: "How do I reset my password?",
      answer: 'To reset your password, click on "Forgot Password" on the login page and follow the instructions.',
    },
  ],
}


const allQuestions = Object.values(faqData).flat()


const categories = [
  { id: "general", name: "General" },
  { id: "billing", name: "Billing & Invoicing" },
  { id: "payment", name: "Payment Processing" },
  { id: "analytics", name: "Analytics & Reporting" },
  { id: "portal", name: "Customer Portal" },
  { id: "integration", name: "Integration & Security" },
  { id: "troubleshooting", name: "Troubleshooting" },
]

type Message = {
  role: "user" | "bot"
  content: string
}

export default function HelpCenter() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", content: "Hi there! I'm your Invoicify assistant. How can I help you today?" },
  ])
  const [input, setInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // useUserCheck()

  useEffect(() => {
    if (activeTab === "chat") {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [activeTab])

  const handleSend = () => {
    if (!input.trim()) return

    
    setMessages((prev) => [...prev, { role: "user", content: input }])

   
    const userQuestion = input.toLowerCase()
    const matchingQuestion = allQuestions.find(
      (q) =>
        q.question.toLowerCase().includes(userQuestion) ||
        userQuestion.includes(q.question.toLowerCase().substring(0, 10)),
    )

   
    setTimeout(() => {
      if (matchingQuestion) {
        setMessages((prev) => [...prev, { role: "bot", content: matchingQuestion.answer }])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content:
              "I'm not sure I understand your question. Please contact us at mineshpatel029@gmail.com for further assistance.",
          },
        ])
      }
    }, 500)

    setInput("")
  }

  const handleQuestionClick = (question: string, answer: string) => {
    setMessages((prev) => [...prev, { role: "user", content: question }, { role: "bot", content: answer }])
    setActiveTab("chat")
  }

  const filteredQuestions = searchQuery
    ? allQuestions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : []

  return (
    <main className=" flex -1 h-full overflow-hidden">
      <Card className="w-full  rounded-none border-0 shadow-none">
        <div className="flex flex-col h-full">
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Help Center</h1>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="chat" className="flex items-center gap-2">
                    <Bot size={16} />
                    <span>Chat</span>
                  </TabsTrigger>
                  <TabsTrigger value="faq" className="flex items-center gap-2">
                    <Search size={16} />
                    <span>FAQs</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>

          <div className="flex-1 overflow-hidden">
            {activeTab === "chat" ? (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-end p-2 border-b">
                  {messages.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setMessages([
                          { role: "bot", content: "Hi there! I'm your Invoicify assistant. How can I help you today?" },
                        ])
                      }
                    >
                      <X size={16} className="mr-2" />
                      Clear Chat
                    </Button>
                  )}
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex items-start gap-3",
                          message.role === "user" ? "ml-auto justify-end w-full" : "max-w-[80%]",
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                            message.role === "user" ? "bg-primary text-primary-foreground order-2" : "bg-muted",
                          )}
                        >
                          {message.role === "user" ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div
                          className={cn(
                            "rounded-lg p-3",
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-4 border-t">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSend()
                    }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your question here..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send size={16} />
                    </Button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search FAQs..."
                    className="w-full"
                  />
                </div>

                <ScrollArea className="flex-1">
                  {searchQuery ? (
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-4">Search Results</h3>
                      {filteredQuestions.length > 0 ? (
                        <div className="space-y-4">
                          {filteredQuestions.map((item, index) => (
                            <Card
                              key={index}
                              className="cursor-pointer hover:bg-muted/50"
                              onClick={() => handleQuestionClick(item.question, item.answer)}
                            >
                              <CardHeader className="p-4">
                                <CardTitle className="text-base">{item.question}</CardTitle>
                              </CardHeader>
                              <CardContent className="p-4 pt-0">
                                <p className="text-sm text-muted-foreground">{item.answer}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground p-4">No results found. Try a different search term.</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 space-y-8">
                      {categories.map((category) => (
                        <div key={category.id} id={category.id}>
                          <h3 className="text-lg font-medium mb-4">{category.name}</h3>
                          <div className="space-y-4">
                            {faqData[category.id as keyof typeof faqData].map((item, index) => (
                              <Card
                                key={index}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => handleQuestionClick(item.question, item.answer)}
                              >
                                <CardHeader className="p-4">
                                  <CardTitle className="text-base">{item.question}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                          {category.id !== "troubleshooting" && <Separator className="my-6" />}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </Card>
    </main>
  )
}

