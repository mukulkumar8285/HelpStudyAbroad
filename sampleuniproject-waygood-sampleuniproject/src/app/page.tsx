'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CourseCard from '@/components/course-card';
import { Compass, Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import type { Course } from '@/lib/types';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('all');
  const [courseLevel, setCourseLevel] = useState('all');
  const [tuitionRange, setTuitionRange] = useState([0, 50000]);

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/courses/search');
        setCourses(res.data);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };
    fetchCourses();
  }, []);

  // Get unique universities from course data
  const universityOptions = useMemo(() => {
    const uniqueUniversities = Array.from(new Set(courses.map(course => course.University)));
    return ['all', ...uniqueUniversities];
  }, [courses]);

  // Get unique course levels
  const courseLevels = useMemo(() => {
    const levels = Array.from(new Set(courses.map(course => course.Level)));
    return ['all', ...levels];
  }, [courses]);

  // Filter courses based on search, university, level, tuition
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch =
        course.Program_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.Description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesUniversity =
        selectedUniversity === 'all' || course.University === selectedUniversity;

      const matchesLevel =
        courseLevel === 'all' || course.Level === courseLevel;

      const matchesTuition =
        course.Cost_USD_Per_Year >= tuitionRange[0] &&
        course.Cost_USD_Per_Year <= tuitionRange[1];

      return matchesSearch && matchesUniversity && matchesLevel && matchesTuition;
    });
  }, [courses, searchTerm, selectedUniversity, courseLevel, tuitionRange]);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="text-center py-20 px-4 bg-card border-b">
        <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tight text-primary">
          Find Your Perfect Course
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Navigate the world of education with Course Compass. Search thousands of courses from top universities to find the one that's right for you.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="#search">
              <Compass className="mr-2" /> Start Exploring
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/course-match">
              <Sparkles className="mr-2" /> AI Course Match
            </Link>
          </Button>
        </div>
      </section>

      {/* Filters & Courses */}
      <section id="search" className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <aside className="lg:col-span-1">
            <div className="p-6 rounded-lg bg-card shadow-sm sticky top-24">
              <h3 className="font-headline text-2xl font-semibold mb-6 flex items-center gap-2 text-primary">
                <SlidersHorizontal />
                Filters
              </h3>
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label htmlFor="search-term" className="text-sm font-medium">Search by Keyword</label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="search-term"
                      type="text"
                      placeholder="e.g. Data Science"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* University */}
                <div>
                  <label htmlFor="university" className="text-sm font-medium">University</label>
                  <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
                    <SelectTrigger id="university" className="w-full mt-2">
                      <SelectValue placeholder="Select University" />
                    </SelectTrigger>
                    <SelectContent>
                      {universityOptions.map(uni => (
                        <SelectItem key={uni} value={uni}>{uni === 'all' ? 'All Universities' : uni}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Course Level */}
                <div>
                  <label htmlFor="course-level" className="text-sm font-medium">Course Level</label>
                  <Select value={courseLevel} onValueChange={setCourseLevel}>
                    <SelectTrigger id="course-level" className="w-full mt-2">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseLevels.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Tuition */}
                <div>
                  <label className="text-sm font-medium">
                    Max. 1st Year Tuition (USD)
                  </label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      min={0}
                      max={50000}
                      step={1000}
                      value={[tuitionRange[1]]}
                      onValueChange={(value) => setTuitionRange([tuitionRange[0], value[0]])}
                    />
                  </div>
                  <div className="text-right text-sm text-muted-foreground mt-1">
                    Up to ${tuitionRange[1].toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Courses */}
          <main className="lg:col-span-3">
            <h2 className="font-headline text-3xl font-bold mb-6 text-primary">
              {filteredCourses.length} Courses Found
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map(course => (
                <CourseCard
                  key={String(course.course_id)}
                  course={{
                    Program_Name: course.Program_Name,
                    University: course.University,
                    Description: course.Description,
                    Level: course.Level,
                    Duration_Months: course.durationMonths ?? 0,
                    Language: course.Language ?? '',
                    Cost_USD_Per_Year: course.Cost_USD_Per_Year ?? 0,
                    Application_Deadline: course.Application_Deadline ?? '',
                    Program_Type: course.Program_Type ?? '',
                    Subject_Area: course.Subject_Area ?? '',
                    courseUrl: `/courses/${course.course_id}`,
                  }}
                />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center bg-card rounded-lg p-12 h-full">
                <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold text-primary">No Courses Found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters to find what you're looking for.</p>
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}
