import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getActivityDetail } from '../services/api';
import { Box, Card, CardContent, Divider, Typography } from '@mui/material';

const ActivityDetail = () => {
  const { id } = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    const fetchActivityDetail = async () => {
      try {
        const response = await getActivityDetail(id);
        setActivity(response.data);
        setRecommendation(response.data.recommendation);
      } catch (error) {
        console.error(error);
      }
    }
    fetchActivityDetail();
  }, [id]);

  if (!activity) {
    return <Typography>Loading...</Typography>
  }
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
            <Card sx={{ mb: 2 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Activity Details</Typography>
                    <Typography>Type: {activity.type}</Typography>
                    <Typography>Duration: {activity.duration} minutes</Typography>

                    {activity.distance && (
                      <Typography>Distance: {activity.distance} km</Typography>
                    )}

                    {activity.pace && (
                      <Typography>Pace: {activity.pace} min/km</Typography>
                    )}

                    {activity.averageHeartRate && (
                      <Typography>Average HR: {activity.averageHeartRate} bpm</Typography>
                    )}

                    <Typography>Calories Burned: {activity.caloriesBurned}</Typography>

                    <Typography>
                      Start Time:{" "}
                      {activity.startTime
                        ? new Date(activity.startTime).toLocaleString()
                        : "Not Provided"}
                    </Typography>

                    <Typography>
                      End Time:{" "}
                      {activity.endTime
                        ? new Date(activity.endTime).toLocaleString()
                        : "Not Provided"}
                    </Typography>
{/*                     <Typography>Type: {activity.type}</Typography> */}
{/*                     <Typography>Duration: {activity.duration} minutes</Typography> */}
{/*                     <Typography>Calories Burned: {activity.caloriesBurned}</Typography> */}
{/*                     <Typography> */}
{/*                             Start Time:{" "} */}
{/*                             {activity.startTime */}
{/*                                 ? new Date(activity.startTime).toLocaleString() */}
{/*                                 : "Not Provided"} */}
{/*                         </Typography> */}

                </CardContent>
            </Card>
            {recommendation && (
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    AI Recommendation
                  </Typography>

                  {/* Analysis */}
                  <Typography variant="h6">Overall Analysis</Typography>
                  <Typography paragraph>
                    {recommendation.analysis?.overall}
                  </Typography>

                  <Typography variant="h6">Pace Analysis</Typography>
                  <Typography paragraph>
                    {recommendation.analysis?.pace}
                  </Typography>

                  <Typography variant="h6">Heart Rate Analysis</Typography>
                  <Typography paragraph>
                    {recommendation.analysis?.heartRate}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  {/* Improvements */}
                  <Typography variant="h6">Improvements</Typography>
                  {recommendation.improvements?.map((item, index) => (
                    <Typography key={index} paragraph>
                      • {item.area}: {item.recommendation}
                    </Typography>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  {/* Suggestions */}
                  <Typography variant="h6">Suggestions</Typography>
                  {recommendation.suggestions?.map((item, index) => (
                    <Typography key={index} paragraph>
                      • {item.workout}: {item.description}
                    </Typography>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  {/* Safety */}
                  <Typography variant="h6">Safety Guidelines</Typography>
                  {recommendation.safety?.map((item, index) => (
                    <Typography key={index} paragraph>
                      • {item}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            )}

{/*             {recommendation && ( */}
{/*                 <Card> */}
{/*                     <CardContent> */}
{/*                         <Typography variant="h5" gutterBottom>AI Recommendation</Typography> */}
{/*                         <Typography variant="h6">Analysis</Typography> */}
{/*                         <Typography paragraph>{activity.recommendation}</Typography> */}
{/*                          */}
{/*                         <Divider sx={{ my: 2 }} /> */}
{/*                          */}
{/*                         <Typography variant="h6">Improvements</Typography> */}
{/*                         {activity?.improvements?.map((improvement, index) => ( */}
{/*                             <Typography key={index} paragraph>• {improvement}</Typography> */}
{/*                         ))} */}
{/*                          */}
{/*                         <Divider sx={{ my: 2 }} /> */}
{/*                          */}
{/*                         <Typography variant="h6">Suggestions</Typography> */}
{/*                         {activity?.suggestions?.map((suggestion, index) => ( */}
{/*                             <Typography key={index} paragraph>• {suggestion}</Typography> */}
{/*                         ))} */}
{/*                          */}
{/*                         <Divider sx={{ my: 2 }} /> */}
{/*                          */}
{/*                         <Typography variant="h6">Safety Guidelines</Typography> */}
{/*                         {activity?.safety?.map((safety, index) => ( */}
{/*                             <Typography key={index} paragraph>• {safety}</Typography> */}
{/*                         ))} */}
{/*                     </CardContent> */}
{/*                 </Card> */}
{/*                 )} */}
                </Box>
          )
        }
        
        export default ActivityDetail