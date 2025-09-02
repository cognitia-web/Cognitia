import QAInterface from "@/components/study/qa-interface";

export default function QA() {
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Q&A Assistant</h1>
          <p className="text-muted-foreground">Ask any question and get smart, customized answers from AI</p>
        </div>
        
        <QAInterface />
      </div>
    </div>
  );
}
