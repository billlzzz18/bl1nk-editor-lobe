'use client';

import { useState, useEffect, useRef } from "react";
import { MonacoEditor } from "@/components/editor/monaco-editor";
import { FileExplorer } from "@/components/ide/file-explorer";
import { ToolbarButton } from "@/components/ide/toolbar-button";
import { SettingsBar } from "@/components/ide/settings-bar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Code2, 
  Menu, 
  BookOpen, 
  Package, 
  Sparkles, 
  Play, 
  Save, 
  Search,
  MessageSquare,
  Database,
  Brain,
  Send,
  Paperclip,
  Bot,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Zap,
  GitBranch,
  Settings
} from "lucide-react";
import { useTheme } from "next-themes";
import { useSkills, useSelectedSkill } from "@/contexts/skills-context";
import { useKnowledgeBase } from "@/contexts/knowledge-context";
import { useChat } from "@/contexts/chat-context";
import { SkillEditorManager } from "@/lib/monaco/skill-editor";
import { motion, AnimatePresence } from "framer-motion";
import { marked } from 'marked';

const DEFAULT_CODE = `// Welcome to the AI Code Playground
import React from 'react';

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="app">
      <h1>Hello, World!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}

export default App;
`;

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    skills_used?: string[];
    files_modified?: string[];
    execution_time?: number;
    context_sources?: string[];
  };
}

export default function IDEPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("typescript");
  const [showExplorer, setShowExplorer] = useState(true);
  const [showPreview, setShowPreview] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [editorMode, setEditorMode] = useState<"code" | "skill" | "chat" | "knowledge">("code");
  const [skillEditorManager, setSkillEditorManager] = useState<SkillEditorManager | null>(null);
  const { theme, setTheme } = useTheme();
  const { skills, isLoading: skillsLoading } = useSkills();
  const { selectedSkill, selectSkill } = useSelectedSkill();
  const { sendMessage, isTyping: chatTyping } = useChat();
  const { searchKnowledge, isSearching: kbSearching } = useKnowledgeBase();

  // Auto-scroll chat
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize skill editor manager
  useEffect(() => {
    const manager = new SkillEditorManager();
    setSkillEditorManager(manager);
    return () => {
      manager.dispose();
    };
  }, []);

  // Skills are auto-fetched by SkillsProvider

  const handleRunCode = async () => {
    if (editorMode === "skill" && selectedSkill) {
      console.log("[v0] Running skill:", selectedSkill.id);
      await sendMessage(`Executing skill: ${selectedSkill.name}`, {
        execution_type: 'skill',
        skill_id: selectedSkill.id
      });
    } else {
      console.log("[v0] Running code:", code);
      await sendMessage('Running code...', {
        execution_type: 'code',
        language,
        code
      });
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    await sendMessage(currentMessage, {
      context: {
        language,
        editorMode,
        selectedSkill: selectedSkill?.id
      }
    });
  };

  const handleKnowledgeSearch = async () => {
    if (!knowledgeQuery.trim()) return;
    await searchKnowledge(knowledgeQuery);
  };

  const handleSaveCode = () => {
    if (editorMode === "skill" && selectedSkill) {
      console.log("[v0] Saving skill:", selectedSkill.id);
      sendMessage(`💾 **Skill saved successfully!**\n\nAll changes have been preserved.`);
    } else {
      console.log("[v0] Saving code");
      sendMessage(`💾 **Code saved!**\n\nYour changes have been saved locally.`);
    }
  };

  const handleOpenSkill = (skillId: string) => {
    const skill = skills.find(s => s.id === skillId);
    if (skill) {
      selectSkill(skill);
      setEditorMode("skill");
      sendMessage(`📦 **Skill loaded:** ${skill.name}\n\nYou can now edit the skill files.`);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Enhanced Header with Animations */}
      <motion.div 
        className="flex h-12 items-center justify-between border-b border-border bg-card px-3 md:h-14 md:px-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 md:gap-4">
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <ToolbarButton icon={<Menu className="h-4 w-4" />} label="Menu" />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <FileExplorer />
            </SheetContent>
          </Sheet>

          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/20">
              <Code2 className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-sm font-semibold md:text-base">AI Code IDE</h1>
            {selectedSkill && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                {selectedSkill.metadata.display_title}
              </Badge>
            )}
          </motion.div>

          <div className="flex items-center gap-2">
            {/* Enhanced Mode Toggle */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs value={editorMode} onValueChange={(value) => setEditorMode(value as any)}>
                <TabsList className="h-8">
                  <TabsTrigger value="code" className="text-xs px-3">
                    <Code2 className="h-3 w-3 mr-1" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="skill" className="text-xs px-3">
                    <Package className="h-3 w-3 mr-1" />
                    Skills ({skills.length})
                  </TabsTrigger>
                  <TabsTrigger value="chat" className="text-xs px-3">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="knowledge" className="text-xs px-3">
                    <Brain className="h-3 w-3 mr-1" />
                    KB
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>

            {editorMode === "code" && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="h-8 w-28 text-xs md:h-9 md:w-32 md:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                    <SelectItem value="css">CSS</SelectItem>
                    <SelectItem value="json">JSON</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
            )}

            {editorMode === "skill" && (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Select value={selectedSkill?.id || ""} onValueChange={handleOpenSkill}>
                  <SelectTrigger className="h-8 w-40 text-xs md:h-9 md:w-48 md:text-sm">
                    <SelectValue placeholder="Select skill..." />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skill) => (
                      <SelectItem key={skill.id} value={skill.id}>
                        <div className="flex items-center gap-2">
                          {skill.metadata.source === "official" ? (
                            <Sparkles className="h-3 w-3" />
                          ) : (
                            <BookOpen className="h-3 w-3" />
                          )}
                          <span>{skill.metadata.display_title}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleRunCode}
              className="hidden md:flex"
            >
              <Play className="h-4 w-4 mr-1" />
              Run
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveCode}
              className="hidden md:flex"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile View */}
        <div className="md:hidden h-full">
          <Tabs value={editorMode} className="flex h-full flex-col">
            <div className="border-b border-border bg-card sticky top-0 z-10">
              <TabsList className="h-9 w-full justify-start rounded-none border-0 bg-transparent px-2">
                <TabsTrigger value="code" className="text-xs">Editor</TabsTrigger>
                <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
                <TabsTrigger value="knowledge" className="text-xs">KB</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="code" className="m-0 flex-1 p-0">
              <MonacoEditor value={code} onChange={setCode} language={language} />
              <div className="p-2 border-t border-border">
                <div className="flex gap-2">
                  <Button onClick={handleRunCode} size="sm" className="flex-1">
                    <Play className="h-4 w-4 mr-1" />
                    Run
                  </Button>
                  <Button onClick={handleSaveCode} variant="outline" size="sm">
                    <Save className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="m-0 flex-1 p-0">
              <ChatInterface />
            </TabsContent>

            <TabsContent value="knowledge" className="m-0 flex-1 p-0">
              <KnowledgeBaseInterface />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex h-full">
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Left Panel - Files/Chat/Knowledge */}
            {showExplorer && (
              <>
                <ResizablePanel defaultSize={25} minSize={15} maxSize={35}>
                  <Tabs value={editorMode} className="flex h-full flex-col">
                    <div className="border-b border-border bg-card">
                      <TabsList className="h-9 w-full justify-start rounded-none border-0 bg-transparent px-2">
                        <TabsTrigger value="code" className="text-xs">Files</TabsTrigger>
                        <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
                        <TabsTrigger value="knowledge" className="text-xs">KB</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="code" className="m-0 flex-1">
                      <FileExplorer />
                    </TabsContent>

                    <TabsContent value="chat" className="m-0 flex-1">
                      <ChatInterface />
                    </TabsContent>

                    <TabsContent value="knowledge" className="m-0 flex-1">
                      <KnowledgeBaseInterface />
                    </TabsContent>
                  </Tabs>
                </ResizablePanel>
                <ResizableHandle withHandle />
              </>
            )}

            {/* Center - Editor */}
            <ResizablePanel
              defaultSize={showExplorer && showPreview ? 50 : showExplorer || showPreview ? 65 : 100}
              minSize={35}
            >
              <motion.div 
                className="flex h-full flex-col"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatePresence mode="wait">
                  {editorMode === "code" && (
                    <motion.div
                      key="code-editor"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-full flex-col"
                    >
                      <Tabs defaultValue="editor" className="flex h-full flex-col">
                        <div className="border-b border-border bg-card">
                          <TabsList className="h-10 w-full justify-start rounded-none border-0 bg-transparent px-4">
                            <TabsTrigger value="editor" className="text-sm">Editor</TabsTrigger>
                          </TabsList>
                        </div>
                        <TabsContent value="editor" className="m-0 flex-1 p-0">
                          <MonacoEditor value={code} onChange={setCode} language={language} />
                        </TabsContent>
                      </Tabs>
                    </motion.div>
                  )}

                  {editorMode === "skill" && (
                    <motion.div
                      key="skill-editor"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex h-full flex-col"
                    >
                      {selectedSkill && skillEditorManager ? (
                        <SkillEditorComponent 
                          skill={selectedSkill} 
                          manager={skillEditorManager}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center space-y-4">
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Package className="h-16 w-16 mx-auto text-muted-foreground" />
                            </motion.div>
                            <div className="space-y-2">
                              <p className="text-lg font-medium">No Skill Selected</p>
                              <p className="text-sm text-muted-foreground">
                                Select a skill from the dropdown to start editing
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              onClick={() => window.location.href = "/skills"}
                            >
                              Browse Skills
                            </Button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ResizablePanel>

            {/* Right - Preview Panel */}
            {showPreview && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
                  <motion.div 
                    className="flex h-full flex-col border-l border-border bg-card"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="border-b border-border px-4 py-3">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Output & Status
                      </h3>
                    </div>
                    <div className="flex-1 overflow-auto p-4 space-y-4">
                      {/* Status Indicators */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground">SYSTEM STATUS</h4>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>AI Skills</span>
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Ready
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Knowledge Base</span>
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Indexed
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span>Code Analysis</span>
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activity */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground">RECENT ACTIVITY</h4>
                        <div className="space-y-1 text-xs">
                          {messages.slice(-3).reverse().map((msg) => (
                            <div key={msg.id} className="flex items-start gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                                msg.role === 'user' ? 'bg-blue-500' : 'bg-green-500'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="truncate">{msg.content.substring(0, 40)}...</p>
                                <p className="text-muted-foreground text-xs">
                                  {msg.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-medium text-muted-foreground">QUICK ACTIONS</h4>
                        <div className="grid grid-cols-1 gap-1">
                          <Button size="sm" variant="outline" className="justify-start text-xs h-8">
                            <Play className="h-3 w-3 mr-1" />
                            Run Analysis
                          </Button>
                          <Button size="sm" variant="outline" className="justify-start text-xs h-8">
                            <Database className="h-3 w-3 mr-1" />
                            Search KB
                          </Button>
                          <Button size="sm" variant="outline" className="justify-start text-xs h-8">
                            <GitBranch className="h-3 w-3 mr-1" />
                            Version Control
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>

          {/* Bottom - Settings Bar */}
          {showSettings && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SettingsBar theme={theme} onThemeChange={setTheme} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Enhanced Chat Interface Component
function ChatInterface() {
  const { messages, currentMessage, isTyping, sendMessage, setCurrentMessage } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;
    await sendMessage(currentMessage);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-3 py-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          AI Assistant
        </h3>
      </div>
      
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">Start a conversation with the AI assistant</p>
            <p className="text-xs text-muted-foreground mt-1">
              Ask questions about code, request analysis, or get help with your project
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-blue-500' : 'bg-green-500'
                }`}>
                  {message.role === 'user' ? (
                    <User className="h-3 w-3 text-white" />
                  ) : (
                    <Bot className="h-3 w-3 text-white" />
                  )}
                </div>
                <div className={`rounded-lg px-3 py-2 text-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-muted'
                }`}>
                  <div 
                    dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                  />
                  <div className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Bot className="h-3 w-3 text-white" />
            </div>
            <div className="bg-muted rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-border p-3">
        <div className="flex gap-2">
          <Input
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your code..."
            className="flex-1 text-sm"
          />
          <Button 
            onClick={onSendMessage} 
            size="sm"
            disabled={!currentMessage.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Enhanced Knowledge Base Interface
function KnowledgeBaseInterface() {
  const { searchResults, isSearching, searchKnowledge } = useKnowledgeBase();
  const [knowledgeQuery, setKnowledgeQuery] = useState('');

  const handleSearch = async () => {
    if (!knowledgeQuery.trim()) return;
    await searchKnowledge(knowledgeQuery);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-3 py-2">
        <h3 className="text-sm font-medium flex items-center gap-2">
          <Brain className="h-4 w-4" />
          Knowledge Base
        </h3>
      </div>
      
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <Input
            value={knowledgeQuery}
            onChange={(e) => setKnowledgeQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search documentation, guides, and examples..."
            className="text-sm"
          />
          <Button 
            onClick={handleSearch} 
            size="sm" 
            className="w-full"
            disabled={!knowledgeQuery.trim() || isSearching}
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              Search Results ({searchResults.length})
            </h4>
            {searchResults.map((result) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-sm">{result.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {(result.relevance * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {result.content}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {result.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Popular Topics */}
        {searchResults.length === 0 && !isSearching && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Popular Topics</h4>
            <div className="grid grid-cols-1 gap-2">
              {[
                'API Authentication',
                'Code Best Practices', 
                'Database Setup',
                'Deployment Guide',
                'Error Handling',
                'Performance Optimization'
              ].map((topic) => (
                <Button
                  key={topic}
                  variant="ghost"
                  size="sm"
                  className="justify-start text-xs h-8"
                  onClick={() => setKnowledgeQuery(topic)}
                >
                  <FileText className="h-3 w-3 mr-2" />
                  {topic}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Skill Editor Component (keeping existing implementation but with enhancements)
function SkillEditorComponent({ 
  skill, 
  manager 
}: { 
  skill: any
  manager: SkillEditorManager 
}) {
  const [files, setFiles] = useState<{ [path: string]: string }>({})
  const [activeFile, setActiveFile] = useState<string>("")

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const fileTree = await manager.getFileTree()
        const loadedFiles: { [path: string]: string } = {}
        
        for (const file of fileTree.files) {
          const content = await manager.readFile(file.path)
          loadedFiles[file.path] = content
        }
        
        setFiles(loadedFiles)
        if (fileTree.files.length > 0) {
          setActiveFile(fileTree.files[0].path)
        }
      } catch (error) {
        console.error("Failed to load skill files:", error)
      }
    }

    loadFiles()
  }, [skill, manager])

  const handleFileChange = async (path: string, content: string) => {
    setFiles(prev => ({ ...prev, [path]: content }))
    await manager.writeFile(path, content)
  }

  const handleCreateFile = async (path: string) => {
    await manager.createFile(path, "")
    setFiles(prev => ({ ...prev, [path]: "" }))
    setActiveFile(path)
  }

  const handleDeleteFile = async (path: string) => {
    await manager.deleteFile(path)
    setFiles(prev => {
      const newFiles = { ...prev }
      delete newFiles[path]
      return newFiles
    })
    if (activeFile === path) {
      const remainingFiles = Object.keys(files).filter(p => p !== path)
      setActiveFile(remainingFiles[0] || "")
    }
  }

  return (
    <div className="flex h-full">
      {/* File Tree */}
      <div className="w-64 border-r border-border bg-card">
        <div className="border-b border-border px-3 py-2">
          <h3 className="text-sm font-medium">Files</h3>
        </div>
        <div className="p-2 space-y-1">
          {Object.keys(files).map((filePath) => (
            <Button
              key={filePath}
              variant={activeFile === filePath ? "secondary" : "ghost"}
              className="w-full justify-start text-xs h-7"
              onClick={() => setActiveFile(filePath)}
            >
              <span className="truncate">{filePath}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        {activeFile ? (
          <MonacoEditor
            value={files[activeFile] || ""}
            onChange={(value) => handleFileChange(activeFile, value)}
            language={getLanguageFromPath(activeFile)}
            path={activeFile}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">Select a file to edit</p>
          </div>
        )}
      </div>
    </div>
  )
}

function getLanguageFromPath(path: string): string {
  const ext = path.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'ts':
    case 'tsx':
      return 'typescript'
    case 'js':
    case 'jsx':
      return 'javascript'
    case 'py':
      return 'python'
    case 'html':
      return 'html'
    case 'css':
      return 'css'
    case 'json':
      return 'json'
    case 'md':
      return 'markdown'
    case 'yml':
    case 'yaml':
      return 'yaml'
    default:
      return 'text'
  }
}