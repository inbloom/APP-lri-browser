
var tmpJsonStandards = {
    'CCSS':{
        '_text':'Common Core State Standards Initiative',
        'Math':{
            '_text':'Mathematics',
            'Content': {
                '_text':'',
                'K':{
                    '_text':'Kindergarten',
                    'CC':{
                        '_text':'Counting & Cardinality',
                        'A':{
                            '_text':'Know number names and the count sequence.',
                            '1':{
                                '_text':'Count to 100 by ones and by tens.'
                            },
                            '2':{
                                '_text':'Count forward beginning from a given number within the known sequence (instead of having to begin at 1).'
                            },
                            '3':{
                                '_text':'Write numbers from 0 to 20. Represent a number of objects with a written numeral 0-20 (with 0 representing a count of no objects).'
                            }
                        },
                        'B':{
                            '_text':'Count to tell the number of objects.',
                            '4':{
                                '_text':'Understand the relationship between numbers and quantities; connect counting to cardinality.'
                            },
                            '4a':{
                                '_text':'When counting objects, say the number names in the standard order, pairing each object with one and only one number name and each number name with one and only one object.'
                            },
                            '4b':{
                                '_text':'Understand that the last number name said tells the number of objects counted. The number of objects is the same regardless of their arrangement or the order in which they were counted.'
                            },
                            '4c':{
                                '_text':'Understand that each successive number name refers to a quantity that is one larger.'
                            },
                            '5':{
                                '_text':'Count to answer “how many?” questions about as many as 20 things arranged in a line, a rectangular array, or a circle, or as many as 10 things in a scattered configuration; given a number from 1–20, count out that many objects.'
                            }
                        },
                        'C':{
                            '_text':'Compare Numbers.',
                            '6':{
                                '_text':'Identify whether the number of objects in one group is greater than, less than, or equal to the number of objects in another group, e.g., by using matching and counting strategies.'
                            },
                            '7':{
                                '_text':'Compare two numbers between 1 and 10 presented as written numerals.'
                            }
                        }
                    },
                    'OA':{
                        '_text':'Operations & Algebraic Thinking',
                        'A':{
                            '_text':'Understand addition, and understand subtaction.',
                            '1':{
                                '_text':'Represent addition and subtraction with objects, fingers, mental images, drawings1, sounds (e.g., claps), acting out situations, verbal explanations, expressions, or equations.'
                            },
                            '2':{
                                '_text':'Solve addition and subtraction word problems, and add and subtract within 10, e.g., by using objects or drawings to represent the problem.'
                            },
                            '3':{
                                '_text':'Decompose numbers less than or equal to 10 into pairs in more than one way, e.g., by using objects or drawings, and record each decomposition by a drawing or equation (e.g., 5 = 2 + 3 and 5 = 4 + 1).'
                            },
                            '4':{
                                '_text':'For any number from 1 to 9, find the number that makes 10 when added to the given number, e.g., by using objects or drawings, and record the answer with a drawing or equation.'
                            },
                            '5':{
                                '_text':'Fluently add and subtract within 5.'
                            }
                        }
                    },
                    'NBT':{
                        '_text':'Number & Operations in Base Ten',
                        'A':{
                            '_text':'Work with numbers 11-19 to gain foundations for place value.',
                            '1': {
                                '_text':'Compose and decompose numbers from 11 to 19 into ten ones and some further ones, e.g., by using objects or drawings, and record each composition or decomposition by a drawing or equation (such as 18 = 10 + 8); understand that these numbers are composed of ten ones and one, two, three, four, five, six, seven, eight, or nine ones.'
                            }
                        }
                    },
                    'MD':{
                        '_text':'Measurement & data',
                        'A':{
                            '_text':'Describe and compare measurable attributes.',
                            '1':{
                                '_text':'Describe measurable attributes of objects, such as length or weight. Describe several measurable attributes of a single object.'
                            },
                            '2':{
                                '_text':'Directly compare two objects with a measurable attribute in common, to see which object has “more of”/“less of” the attribute, and describe the difference. For example, directly compare the heights of two children and describe one child as taller/shorter.'
                            }
                        },
                        'B':{
                            '_text':'Classify objects and count the number of objects in each category.',
                            '3':{
                                '_text':'Classify objects into given categories; count the numbers of objects in each category and sort the categories by count.'
                            }
                        }
                    },
                    'G':{
                        '_text':'Geometry',
                        'A':{
                            '_text':'Identify and describe shapes.',
                            '1':{
                                '_text':'Describe objects in the environment using names of shapes, and describe the relative positions of these objects using terms such as above, below, beside, in front of, behind, and next to.'
                            },
                            '2':{
                                '_text':'Correctly name shapes regardless of their orientations or overall size.'
                            },
                            '3':{
                                '_text':'Identify shapes as two-dimensional (lying in a plane, “flat”) or three-dimensional (“solid”).'
                            }
                        },
                        'B':{
                            '_text':'Analyze, compare, create, and compose shapes.',
                            '4':{
                                '_text':'Analyze and compare two- and three-dimensional shapes, in different sizes and orientations, using informal language to describe their similarities, differences, parts (e.g., number of sides and vertices/“corners”) and other attributes (e.g., having sides of equal length).'
                            },
                            '5':{
                                '_text':'Model shapes in the world by building shapes from components (e.g., sticks and clay balls) and drawing shapes.'
                            },
                            '6':{
                                '_text':'Compose simple shapes to form larger shapes. For example, “Can you join these two triangles with full sides touching to make a rectangle?”'
                            }
                        }
                    }
                },

// THOSE BELOW ARE NOT DONE A TALL

                '1':{
                    '_text':'Grade 1',
                    'OA':{
                        '_text':'Operations & Algebraic Thinking',
                        'A':{
                            '_text':'Represent and solve problems involving addition and subtraction',
                            '1':{
                                '_text':'Use addition and subtraction within 20 to solve word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.'
                            },
                            '2':{
                                '_text':'Solve word problems that call for addition of three whole numbers whose sum is less than or equal to 20, e.g., by using objects, drawings, and equations with a symbol for the unknown number to represent the problem.'
                            }
                        }
                    }
                },

                '2':{
                    '_text':'Grade 2',
                    'OA':{
                        '_text':'Operations & Algebraic Thinking',
                        'A':{
                            '_text':'Represent and solve problems involving addition and subtraction',
                            '1':{
                                '_text':'Use addition and subtraction within 100 to solve one- and two-step word problems involving situations of adding to, taking from, putting together, taking apart, and comparing, with unknowns in all positions, e.g., by using drawings and equations with a symbol for the unknown number to represent the problem.'
                            }
                        }
                    }
                },

                '3':{
                    '_text':'Grade 3'
                },

                '4':{
                    '_text':'Grade 4'
                },

                '5':{
                    '_text':'Grade 5'
                },

                '6':{
                    '_text':'Grade 6'
                },

                '7':{
                    '_text':'Grade 7'
                },

                '8':{
                    '_text':'Grade 8'
                }
            }
        }
    }
}

