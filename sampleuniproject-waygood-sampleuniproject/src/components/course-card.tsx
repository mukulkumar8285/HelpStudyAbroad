import Link from 'next/link';
import type { Course } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Building2, CalendarDays, DollarSign, Globe } from 'lucide-react';

interface CourseCardProps {
  course: {
    Program_Name: string;
    University: string;
    Description: string;
    Level: string;
    Duration_Months: number;
    Language: string;
    Cost_USD_Per_Year: number;
    Application_Deadline: string;
    Program_Type: string;
    Subject_Area: string;
    courseUrl?: string; // optional, if you generate a link
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="font-headline text-xl leading-tight">
          <Link href={course.courseUrl || '#'}>
            {course.Program_Name}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Building2 className="h-4 w-4" /> {course.University}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {course.Description}
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{course.Level}</Badge>
          <Badge variant="secondary">{course.Duration_Months} months</Badge>
          <Badge variant="secondary">{course.Language}</Badge>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-accent" />
            <span>
              <span className="font-semibold">{course.Cost_USD_Per_Year} USD</span> / year
            </span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-accent" />
            <span>Deadline: {new Date(course.Application_Deadline).toLocaleDateString('en-US')}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 p-4">
        <Button asChild className="w-full" variant="outline">
          <Link href={course.courseUrl || '#'}>
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
