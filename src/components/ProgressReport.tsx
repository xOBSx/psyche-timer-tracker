
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface QuestionData {
  questionNumber: number;
  elapsedTime: number;
  timeTaken: number;
}

interface ProgressReportProps {
  questions: QuestionData[];
  totalDuration: number;
  onNewSession: () => void;
}

const ProgressReport: React.FC<ProgressReportProps> = ({
  questions,
  totalDuration,
  onNewSession,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalQuestions = questions.length;
  const averageTime = totalQuestions > 0 
    ? questions.reduce((sum, q) => sum + q.timeTaken, 0) / totalQuestions 
    : 0;
  
  const fastestTime = totalQuestions > 0 
    ? Math.min(...questions.map(q => q.timeTaken))
    : 0;
  
  const slowestTime = totalQuestions > 0 
    ? Math.max(...questions.map(q => q.timeTaken))
    : 0;

  // Create table data with starting row for question 0, using unique keys
  const tableData = [
    {
      questionNumber: 0,
      elapsedTime: 0,
      timeTaken: 0,
      key: 'start-row', // Unique key for the starting row
    },
    ...questions.map(q => ({ ...q, key: `question-${q.questionNumber}` }))
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">Session Report</h1>
          <p className="text-muted-foreground">Detailed analysis of your practice session</p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground">{totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Questions Answered</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground">{formatTime(Math.round(averageTime))}</div>
              <div className="text-sm text-muted-foreground">Average Time</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600">{formatTime(fastestTime)}</div>
              <div className="text-sm text-muted-foreground">Fastest Answer</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600">{formatTime(slowestTime)}</div>
              <div className="text-sm text-muted-foreground">Slowest Answer</div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Question Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center"># Question</TableHead>
                    <TableHead className="text-center">Elapsed Time</TableHead>
                    <TableHead className="text-center">Time Taken</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((question) => (
                    <TableRow key={question.key}>
                      <TableCell className="text-center font-medium">
                        {question.questionNumber}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {formatTime(question.elapsedTime)}
                      </TableCell>
                      <TableCell className="text-center font-mono">
                        {formatTime(question.timeTaken)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={onNewSession} size="lg" className="px-8">
            Start New Session
          </Button>
          <Button 
            variant="outline" 
            size="lg" 
            className="px-8"
            onClick={() => window.print()}
          >
            Print Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProgressReport;
