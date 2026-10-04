#!/usr/bin/env python3
"""
Hostel Attendance Web Application - Local Development & Review Server
Starts a local HTTP server and automatically opens the project in your web browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Disable caching so changes reflect immediately during project review
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    Handler = CustomHTTPRequestHandler
    
    # Try finding an open port starting from 8000
    global PORT
    while PORT < 8020:
        try:
            with socketserver.TCPServer(("", PORT), Handler) as httpd:
                url = f"http://localhost:{PORT}"
                print("=" * 70)
                print("  HOSTEL ATTENDANCE SYSTEM - LOCAL REVIEW SERVER")
                print("=" * 70)
                print(f"  Web Application Running at: {url}")
                print("  Admin Credentials:           Username: admin  |  Password: admin123")
                print("  Sample Student Login:        ID: ECE001       |  Name: Priya")
                print("=" * 70)
                print("  Press Ctrl+C in this terminal to stop the server.\n")
                
                webbrowser.open(url)
                httpd.serve_forever()
                break
        except OSError:
            PORT += 1

if __name__ == '__main__':
    try:
        run_server()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)
