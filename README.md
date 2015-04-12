# DeepMarkit-Segments
merge and sort line segments

This page sorts and merges line segments as described below.

I used Anand Thakker's range slider for a range picker:
http://codepen.io/anandthakker/pen/marlo

See it in action here:
http://lmikulin.github.io/DeepMarkit-Segments/

#####Description of how to merge line segments:

----
Line Segments Code Challenge

This programming challenge requires you to implement a function
that will merge and sort line segments.

A line segment is a data structure that consists of a starting
point and an ending point on a one-dimensional axis of integers.

Here are four examples of line segments:

... -3  -2  -1  0  1  2  3  4  5  6  7  8  9  10 ...

                                        8=====10
            -1==============4
                   1==============6
    -3==-2

The merge and sort function accepts a collection (or array)
of line segments. It returns a collection (or array) of merged
and sorted line segments.

Any line segment that overlaps another or touches end-to-end
should be merged. In the example above, the three left-most line
segments would be merged, and the single right-most would be a
separate line segment. This would ultimately collapse 4 line
segments into two line segments.

(8,10) ==> (8,10)
(-1,4),(1,6),(-3,-2) ==> (-3,6)

Sorting the line segments should be done by the starting
point first, and then by the ending point. Thus:

(8,10),(-3,6) ==> (-3,6),(8,10)

Treat the problem as real work. Show us your tools, your process
and your best practices!

----
